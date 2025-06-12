import { capitalizeFirstLetter } from "../../src/utils/string";

describe("String Utils", () => {
  describe("capitalizeFirstLetter", () => {
    it("should capitalize the first letter of a string", () => {
      expect(capitalizeFirstLetter("hello")).toBe("Hello");
      expect(capitalizeFirstLetter("WORLD")).toBe("World");
      expect(capitalizeFirstLetter("tEsT")).toBe("Test");
    });

    it("should handle empty string", () => {
      expect(capitalizeFirstLetter("")).toBe("");
    });

    it("should handle single character", () => {
      expect(capitalizeFirstLetter("a")).toBe("A");
      expect(capitalizeFirstLetter("Z")).toBe("Z");
    });
  });
});
