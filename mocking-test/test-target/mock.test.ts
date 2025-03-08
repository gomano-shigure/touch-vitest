import { describe, expect, test, vi } from "vitest";
import { caller } from "./caller";
import { exportedFunction } from "./exportedFunction";

// hoistedで事前にモック先の関数を作っておく
const { exportedFunction: mockedFunction } = vi.hoisted(() => ({
  exportedFunction: vi.fn().mockImplementationOnce(() => "これはモックです。"),
}));
// モックで差し替え
vi.mock("./exportedFunction", () => {
  return { exportedFunction: mockedFunction };
});

//最初のテスト
describe("モックを使ってみる", () => {
  test("モックが返ってきたことを確認する", () => {
    expect(caller()).toBe("これはモックです。");
  });
  test("モックが呼ばれていることを確認する", () => {
    expect(mockedFunction).toHaveBeenCalled();
  });
  test("モックの内容を変えて確認する", () => {
    mockedFunction.mockReturnValueOnce("差し替えたモックです。");
    expect(caller()).toBe("差し替えたモックです。");
  });
});
