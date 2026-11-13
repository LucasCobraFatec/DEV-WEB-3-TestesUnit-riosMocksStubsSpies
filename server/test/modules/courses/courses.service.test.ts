import { HttpError } from "../../../src/errors";
import { CoursesService } from "../../../src/modules/courses/courses.service";

const course = { id: 7, name: "Qualidade" };
const makeRepository = () => ({
  create: jest.fn().mockResolvedValue(course),
  findAll: jest.fn().mockResolvedValue([course]),
  findOne: jest.fn().mockResolvedValue(course),
});
const status = async (promise: Promise<unknown>, statusCode: number) => {
  await expect(promise).rejects.toMatchObject({ statusCode });
};

describe("CoursesService", () => {
  let repository: ReturnType<typeof makeRepository>;
  let service: CoursesService;
  beforeEach(() => { repository = makeRepository(); service = new CoursesService(repository); });

  test("cria curso válido e encaminha os dados", async () => {
    expect(await service.create({ name: "Qualidade" })).toBe(course);
    expect(repository.create).toHaveBeenCalledTimes(1);
    expect(repository.create).toHaveBeenCalledWith({ name: "Qualidade" });
  });
  test.each([null, {}, { name: "A" }])("rejeita entrada inválida sem criar", async (input) => {
    await status(service.create(input), 400);
    expect(repository.create).not.toHaveBeenCalled();
  });
  test("converte nome duplicado em erro 409", async () => {
    repository.create.mockRejectedValue({ code: "23505" });
    await status(service.create({ name: "Qualidade" }), 409);
  });
  test("propaga falha inesperada de create", async () => {
    const error = new Error("falha"); repository.create.mockRejectedValue(error);
    await expect(service.create({ name: "Qualidade" })).rejects.toBe(error);
  });
  test("lista cursos pelo stub", async () => {
    expect(await service.findAll()).toEqual([course]);
    expect(repository.findAll).toHaveBeenCalledTimes(1);
  });
  test("propaga falha inesperada de findAll", async () => {
    const error = new Error("falha"); repository.findAll.mockRejectedValue(error);
    await expect(service.findAll()).rejects.toBe(error);
  });
  test("busca curso existente", async () => {
    expect(await service.findOne(123)).toBe(course);
    expect(repository.findOne).toHaveBeenCalledWith(123);
  });
  test("retorna 404 para curso inexistente", async () => {
    repository.findOne.mockResolvedValue(undefined);
    await status(service.findOne(123), 404);
  });
  test("rejeita identificador inválido sem consultar repositório", async () => {
    await status(service.findOne(0), 400);
    expect(repository.findOne).not.toHaveBeenCalled();
  });
  test("propaga falha inesperada de findOne", async () => {
    const error = new Error("falha"); repository.findOne.mockRejectedValue(error);
    await expect(service.findOne(1)).rejects.toBe(error);
  });
  test("spy observa findOne de um stub existente", async () => {
    const stub = makeRepository(); stub.findOne.mockResolvedValue(course);
    const spy = jest.spyOn(stub, "findOne");
    expect(await new CoursesService(stub).findOne(1)).toBe(course);
    expect(spy).toHaveBeenCalledWith(1);
  });
  test("ignora campos extras na criação", async () => {
    await service.create({ name: "Qualidade", extra: true });
    expect(repository.create).toHaveBeenCalledWith({ name: "Qualidade" });
  });
});
