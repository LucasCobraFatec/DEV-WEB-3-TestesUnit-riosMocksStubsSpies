import { EnrollmentsService } from "../../../src/modules/enrollments/enrollments.service";

const enrollment = { studentRa: 123, courseId: 1, enrolledAt: new Date("2026-01-01T00:00:00.000Z") };
const makeRepository = () => ({
  create: jest.fn().mockResolvedValue(enrollment),
  findAll: jest.fn().mockResolvedValue([enrollment]),
  findOne: jest.fn().mockResolvedValue(enrollment),
});
const status = async (promise: Promise<unknown>, statusCode: number) => expect(promise).rejects.toMatchObject({ statusCode });

describe("EnrollmentsService", () => {
  let repository: ReturnType<typeof makeRepository>;
  let service: EnrollmentsService;
  beforeEach(() => { repository = makeRepository(); service = new EnrollmentsService(repository); });

  test("cria matrícula válida na ordem esperada", async () => {
    expect(await service.create({ studentRa: 123, courseId: 1 })).toBe(enrollment);
    expect(repository.create).toHaveBeenCalledWith(123, 1);
  });
  test.each([{ studentRa: 0, courseId: 1 }, { studentRa: 123, courseId: 0 }])(
    "rejeita identificador inválido sem criar", async (input) => {
      await status(service.create(input), 400);
      expect(repository.create).not.toHaveBeenCalled();
    },
  );
  test("converte chave estrangeira inválida em erro 404", async () => {
    repository.create.mockRejectedValue({ code: "23503" });
    await status(service.create({ studentRa: 123, courseId: 1 }), 404);
  });
  test("converte matrícula duplicada em erro 409", async () => {
    repository.create.mockRejectedValue({ code: "23505" });
    await status(service.create({ studentRa: 123, courseId: 1 }), 409);
  });
  test("busca matrícula inexistente com identificadores ordenados", async () => {
    repository.findOne.mockResolvedValue(undefined);
    await status(service.findOne(123, 1), 404);
    expect(repository.findOne).toHaveBeenCalledWith(123, 1);
  });
  test("propaga falha inesperada da criação", async () => {
    const error = new Error("falha"); repository.create.mockRejectedValue(error);
    await expect(service.create({ studentRa: 123, courseId: 1 })).rejects.toBe(error);
  });
  test("lista matrículas uma vez e sem argumentos", async () => {
    expect(await service.findAll()).toEqual([enrollment]);
    expect(repository.findAll).toHaveBeenCalledTimes(1);
    expect(repository.findAll).toHaveBeenCalledWith();
  });
  test("busca matrícula existente", async () => {
    expect(await service.findOne(123, 1)).toBe(enrollment);
    expect(repository.findOne).toHaveBeenCalledTimes(1);
    expect(repository.findOne).toHaveBeenCalledWith(123, 1);
  });
});
