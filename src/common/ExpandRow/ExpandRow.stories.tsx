import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { ExpandRow } from "./ExpandRow";

const meta = {
  title: "common/ExpandRow",
  component: ExpandRow,
  parameters: { layout: "padded" },
  // Both stories below fully replace rendering via `render`, so these are
  // never actually shown — just enough to satisfy ExpandRow's required props.
  args: { label: "", actionLabel: "", onClick: () => {} },
} satisfies Meta<typeof ExpandRow>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Demo components ───────────────────────────────────────────────────

const CUISINES = ["Italian", "Thai", "Mexican", "French", "Japanese", "Greek", "Indian", "Korean"];
const PREVIEW_COUNT = 3;

/** Expand-once — the row disappears for good once clicked, e.g. the receipt review's matched-items list. */
function ViewAllDemo() {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? CUISINES : CUISINES.slice(0, PREVIEW_COUNT);
  const remaining = CUISINES.length - visible.length;

  return (
    <div className="flex flex-col gap-2">
      <ul className="m-0 list-none p-0 text-sm text-ink">
        {visible.map((cuisine) => (
          <li key={cuisine} className="border-b border-line-soft py-1.5 last:border-b-0">
            {cuisine}
          </li>
        ))}
      </ul>
      {remaining > 0 && (
        <ExpandRow
          label={`${remaining} more cuisines`}
          actionLabel="view all"
          onClick={() => setExpanded(true)}
        />
      )}
    </div>
  );
}

const MONTHS = [
  { label: "March", total: "$412.50" },
  { label: "February", total: "$389.10" },
  { label: "January", total: "$455.80" },
];

/** Expand/collapse toggle — the row stays, alternating label/action, e.g. the spending trend table's exact figures. */
function CollapseDemo() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      {expanded && (
        <ul className="m-0 list-none p-0 text-sm text-ink">
          {MONTHS.map((month) => (
            <li
              key={month.label}
              className="flex justify-between border-b border-line-soft py-1.5 last:border-b-0"
            >
              <span>{month.label}</span>
              <span className="tabular font-mono">{month.total}</span>
            </li>
          ))}
        </ul>
      )}
      <ExpandRow
        label={`Exact figures for all ${MONTHS.length} months`}
        actionLabel={expanded ? "collapse" : "view all"}
        onClick={() => setExpanded((current) => !current)}
      />
    </div>
  );
}

// ─── Interactive states ────────────────────────────────────────────────

export const ViewAll: Story = {
  render: () => <ViewAllDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText("Thai")).not.toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: /view all/i }));

    expect(canvas.getByText("Thai")).toBeInTheDocument();
    expect(canvas.queryByRole("button")).not.toBeInTheDocument();
  },
};

export const Collapse: Story = {
  render: () => <CollapseDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText("February")).not.toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: /view all/i }));
    expect(canvas.getByText("February")).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: /collapse/i }));
    expect(canvas.queryByText("February")).not.toBeInTheDocument();
  },
};
