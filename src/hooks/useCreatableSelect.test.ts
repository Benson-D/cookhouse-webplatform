import { useCreatableSelect } from "./useCreatableSelect";

const findOrCreate = async (name: string) => ({ id: "new", name });
const useOptionNames = (inputValue: string, options: { id: string; name: string }[]) =>
  useCreatableSelect({ options, inputValue, findOrCreate }).options.map((option) => option.name);

describe("useCreatableSelect", () => {
  it("offers to add the typed text when results only contain it", () => {
    expect(useOptionNames("chips", [{ id: "1", name: "masa chips" }])).toEqual([
      "masa chips",
      'Add "chips"',
    ]);
  });

  it("doesn't offer to add something that already exists, ignoring case", () => {
    expect(useOptionNames("Chips", [{ id: "1", name: "chips" }])).toEqual(["chips"]);
  });

  it("offers to add when nothing matches, and never for blank input", () => {
    expect(useOptionNames("salsa", [])).toEqual(['Add "salsa"']);
    expect(useOptionNames("   ", [])).toEqual([]);
  });

  it("creates using the typed text, not the row's label", async () => {
    const select = useCreatableSelect({ options: [], inputValue: " salsa ", findOrCreate });
    await expect(select.handleSelect(select.options[0]!)).resolves.toEqual({
      id: "new",
      name: "salsa",
    });
  });
});
