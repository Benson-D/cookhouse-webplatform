import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { CHSelect } from "./CHSelect";
import { useCreatableSelect } from "@/hooks/useCreatableSelect";

// ─── Fixtures & helpers ──────────────────────────────────────────────────

type Ingredient = { id: string; name: string };

const INGREDIENTS: Ingredient[] = [
  { id: "1", name: "red lentils" },
  { id: "2", name: "yellow onion" },
  { id: "3", name: "garlic cloves" },
  { id: "4", name: "ginger" },
  { id: "5", name: "ground cumin" },
];

const getIngredientId = (item: Ingredient) => item.id;
const getIngredientLabel = (item: Ingredient) => item.name;

/** Real shape from StapleFooter's own frequency picker — proves CHSelect is generic, not just typed for ingredients. */
const FREQUENCY_OPTIONS = [
  { label: "Weekly", days: 7 },
  { label: "Every 2 weeks", days: 14 },
  { label: "Monthly", days: 30 },
  { label: "Every 2 months", days: 60 },
] as const;

// ─── Storybook metadata ───────────────────────────────────────────────────

/**
 * Fixed to `{ id, name }` — the real shape ingredients/units use. `onChange`
 * is mocked; picking an option just logs to the Actions panel. CHSelect
 * itself is a dumb primitive — it has no idea what typed text means and no
 * clear button of its own; see `SearchFilter` and `CreateNewItem` below for
 * how a caller composes those on top of it (the latter via
 * `useCreatableSelect`, which folds a synthetic "Add {name}" row straight
 * into the plain `options` array CHSelect already renders).
 */
const meta = {
  title: "common/CHSelect",
  component: CHSelect<Ingredient>,
  parameters: { layout: "centered" },
  args: {
    value: null,
    options: INGREDIENTS,
    getOptionId: getIngredientId,
    getOptionLabel: getIngredientLabel,
    onChange: fn(),
    ariaLabel: "Ingredient",
    placeholder: "search",
  },
} satisfies Meta<typeof CHSelect<Ingredient>>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Static states ─────────────────────────────────────────────────────

export const Default: Story = {};

export const Preselected: Story = {
  args: { value: INGREDIENTS[0] },
};

export const Invalid: Story = {
  args: { invalid: true },
};

export const WithLabel: Story = {
  args: { label: "Ingredient" },
};

export const WithHint: Story = {
  args: { label: "Ingredient", hint: "Pick an existing ingredient, or type a new one." },
};

export const WithError: Story = {
  args: { label: "Ingredient", error: "Pick an ingredient" },
};

/** Greyed out and unpickable, but still visible — e.g. an ingredient that's already a staple. */
export const DisabledOptions: Story = {
  args: {
    getOptionDisabled: (item) => item.id === "2" || item.id === "4",
  },
};

export const LongOptionNames: Story = {
  args: {
    value: { id: "1", name: "Extra-virgin cold-pressed Sicilian olive oil, first harvest" },
    options: [
      { id: "1", name: "Extra-virgin cold-pressed Sicilian olive oil, first harvest" },
      { id: "2", name: "Freshly grated Parmigiano-Reggiano (aged at least 24 months)" },
      ...INGREDIENTS,
    ],
  },
};

/** Real shape (StapleFooter's frequency picker), not `{ id, name }` — proves the generic typing works for a genuinely different item shape. */
export const DifferentItemShape: Story = {
  render: () => (
    <CHSelect<(typeof FREQUENCY_OPTIONS)[number]>
      ariaLabel="Frequency"
      value={FREQUENCY_OPTIONS[0]}
      options={[...FREQUENCY_OPTIONS]}
      getOptionId={(option) => String(option.days)}
      getOptionLabel={(option) => option.label}
      onChange={fn()}
    />
  ),
};

// ─── Demo components ───────────────────────────────────────────────────

/** Filtering happens here, not inside CHSelect — `onInputChange` is just the underlying input's own change event, same as every real consumer. */
function SearchableDemo() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Ingredient | null>(null);
  const filtered = query.trim()
    ? INGREDIENTS.filter((item) => item.name.toLowerCase().includes(query.trim().toLowerCase()))
    : INGREDIENTS;

  return (
    <CHSelect<Ingredient>
      ariaLabel="Ingredient"
      placeholder="search"
      value={selected}
      options={filtered}
      getOptionId={getIngredientId}
      getOptionLabel={getIngredientLabel}
      onInputChange={(event) => setQuery(event.target.value)}
      onChange={setSelected}
    />
  );
}

/**
 * `useCreatableSelect` composes the search-and-create pattern on top of the
 * dumb primitive — CHSelect only ever sees a plain `options` array with one
 * extra synthetic item folded in, with no idea it means "create a new
 * ingredient." Input/search state lives in the domain hook that owns the
 * search (here, a plain `useState` standing in for `useIngredientSearchPicker`),
 * not in `useCreatableSelect` itself.
 */
function CreatableDemo({ onCreate }: { onCreate: (name: string) => Promise<Ingredient> }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Ingredient | null>(null);
  const creatable = useCreatableSelect({
    options: INGREDIENTS,
    inputValue: query,
    findOrCreate: onCreate,
  });

  return (
    <CHSelect<Ingredient>
      ariaLabel="Ingredient"
      placeholder="search or add an ingredient"
      value={selected}
      options={creatable.options}
      getOptionId={getIngredientId}
      getOptionLabel={getIngredientLabel}
      onInputChange={(event) => setQuery(event.target.value)}
      onChange={async (item) => {
        if (!item) return;
        setSelected(await creatable.handleSelect(item));
      }}
    />
  );
}

// ─── Interactive states ────────────────────────────────────────────────

/** Filters to exactly the matching option — proves onInputChange's caller-side filtering (the real pattern every consumer uses) actually narrows the list. */
export const SearchFilter: Story = {
  render: () => <SearchableDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole("combobox"), "oni");

    const options = canvas.getAllByRole("option");
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent("yellow onion");
  },
};

/** No match and no options to fall back to — the panel has nothing to show. */
export const EmptyResults: Story = {
  render: () => <SearchableDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole("combobox"), "xyz-not-a-real-ingredient");
    expect(canvas.queryByRole("option")).not.toBeInTheDocument();
  },
};

/**
 * Drives the real create flow through `useCreatableSelect`. A transient
 * "Adding…" state (like `useIngredientSearchPicker.isCreating`) is up to
 * whichever domain hook owns the actual mutation — this demo has none, so
 * the option just resolves straight to the created item.
 */
export const CreateNewItem: Story = {
  render: () => (
    <CreatableDemo
      onCreate={async (name) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { id: `new-${name}`, name };
      }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole("combobox"), "smoked paprika");
    await userEvent.click(await canvas.findByText('Add "smoked paprika"'));

    await waitFor(() => expect(canvas.getByDisplayValue("smoked paprika")).toBeInTheDocument());
  },
};
