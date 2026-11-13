import { StudentsService } from "../../../src/modules/students/students.service";

const student = { ra: 123, name: "Ana" };
const makeRepository = () => ({
  create: jest.fn().mockResolvedValue(student),
  findAll: jest.fn().mockResolvedValue([student]),
  findOne: jest.fn().mockResolvedValue(student),
});
const status = async (promise: Promise<unknown>, statusCode: number) => expect(promise).rejects.toMatchObject({ statusCode });

describe("StudentsService", () => {
  let repository: ReturnType<typeof makeRepository>;
  let service: StudentsService;
  beforeEach(() => { repository = makeRepository(); service = new StudentsService(repository); });

  test("cria aluno válido", async () => {
    expect(await service.create(student)).toBe(student);
    expect(repository.create).toHaveBeenCalledWith(student);
  });
  test("rejeita RA inválido sem chamar repositório", async () => {
    await status(service.create({ ra: 0, name: "Ana" }), 400);
    expect(repository.create).not.toHaveBeenCalled();
  });
  test("converte RA duplicado em erro 409", async () => {
    repository.create.mockRejectedValue({ code: "23505" });
    await status(service.create(student), 409);
  });
  test("retorna 404 para aluno inexistente", async () => {
    repository.findOne.mockResolvedValue(undefined);
    await status(service.findOne(123), 404);
  });
  test("propaga erro inesperado da criação", async () => {
    const error = new Error("falha"); repository.create.mockRejectedValue(error);
    await expect(service.create(student)).rejects.toBe(error);
  });
  test("lista alunos uma vez e sem argumentos", async () => {
    expect(await service.findAll()).toEqual([student]);
    expect(repository.findAll).toHaveBeenCalledTimes(1);
    expect(repository.findAll).toHaveBeenCalledWith();
  });
  test("busca aluno por RA", async () => {
    expect(await service.findOne(123)).toBe(student);
    expect(repository.findOne).toHaveBeenCalledTimes(1);
    expect(repository.findOne).toHaveBeenCalledWith(123);
  });
});
