import type { Database } from "../../../src/database/connection";
import { PgEnrollmentRepository } from "../../../src/modules/enrollments/enrollments.repository";

const normalize = (sql: string) => sql.replace(/\s+/g, " ").trim();
const enrolledAt = new Date("2026-01-01T00:00:00.000Z");
const enrollment = { studentRa: 123, courseId: 7, enrolledAt };
const columns = 'student_ra AS "studentRa", course_id AS "courseId", enrolled_at AS "enrolledAt"';
const makeDatabase = () => ({ query: jest.fn<Promise<{ rows: unknown[] }>, [string, unknown[]?]>() });

describe("PgEnrollmentRepository", () => {
  let db: ReturnType<typeof makeDatabase>;
  let repository: PgEnrollmentRepository;
  beforeEach(() => { db = makeDatabase(); repository = new PgEnrollmentRepository(db as unknown as Database); });

  test("insere matrícula com aliases e parâmetros", async () => {
    db.query.mockResolvedValue({ rows: [enrollment] });
    expect(await repository.create(123, 7)).toEqual(enrollment);
    const [sql, values] = db.query.mock.calls[0];
    expect(normalize(sql)).toBe(`INSERT INTO enrollments (student_ra, course_id) VALUES ($1, $2) RETURNING ${columns}`);
    expect(values).toEqual([123, 7]);
    expect(enrollment).toMatchObject({ studentRa: 123, courseId: 7, enrolledAt });
  });
  test("lista matrículas ordenadas com aliases e sem parâmetros", async () => {
    db.query.mockResolvedValue({ rows: [enrollment] });
    expect(await repository.findAll()).toEqual([enrollment]);
    const [sql, values] = db.query.mock.calls[0];
    expect(normalize(sql)).toBe(`SELECT ${columns} FROM enrollments ORDER BY student_ra, course_id`);
    expect(values).toBeUndefined();
  });
  test("retorna lista vazia", async () => {
    db.query.mockResolvedValue({ rows: [] });
    expect(await repository.findAll()).toEqual([]);
  });
  test("busca matrícula por RA e curso com aliases", async () => {
    db.query.mockResolvedValue({ rows: [enrollment] });
    expect(await repository.findOne(123, 7)).toEqual(enrollment);
    const [sql, values] = db.query.mock.calls[0];
    expect(normalize(sql)).toBe(`SELECT ${columns} FROM enrollments WHERE student_ra = $1 AND course_id = $2`);
    expect(values).toEqual([123, 7]);
  });
  test("retorna undefined para matrícula inexistente", async () => {
    db.query.mockResolvedValue({ rows: [] });
    expect(await repository.findOne(123, 7)).toBeUndefined();
  });
  test.each([
    ["create", async (repo: PgEnrollmentRepository) => repo.create(123, 7)],
    ["findAll", async (repo: PgEnrollmentRepository) => repo.findAll()],
    ["findOne", async (repo: PgEnrollmentRepository) => repo.findOne(123, 7)],
  ])("propaga falha de %s", async (_method, call) => {
    const error = new Error("banco indisponível"); db.query.mockRejectedValue(error);
    await expect(call(repository)).rejects.toBe(error);
  });
});
