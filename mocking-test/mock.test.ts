import { describe, expect, test, vi } from "vitest";

// hoistedで事前にモック先の関数を作っておく
const { exportedFunction: mockedFunction } = vi.hoisted(() => ({
  exportedFunction: vi.fn().mockImplementationOnce(() => "これはモックです。"),
}));
// モックで差し替え
import { caller } from "./test-target/caller";
import { exportedFunction } from "./test-target/exportedFunction";

// モックする対象についてはエラーログが流れないため、指定を間違えるとテストが壊れる。
vi.mock("./test-target/exportedFunction", () => {
  return { exportedFunction: mockedFunction };
});

//最初のテスト
describe("モックを使ってみる", () => {
  test("モックできているかどうかを確認する", () => {
    //モックできていることは確認したほうが良いかも。
    expect(vi.isMockFunction(exportedFunction)).toBeTruthy();
  });
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
