import { render, screen, waitFor, within } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import App from "../App";

const waitForTable = async () => {
  await waitFor(
    () => {
      expect(screen.getByTestId("crowdstrike-table")).toBeInTheDocument();
    },
    { timeout: 3000 }
  );
};

const waitForRows = async () => {
  await waitFor(
    () => {
      expect(screen.getAllByTestId("crowdstrike-row").length).toBeGreaterThan(
        0
      );
    },
    { timeout: 3000 }
  );
};

const getTbody = async () =>
  screen.getByTestId("crowdstrike-table").querySelector("tbody");

describe("CrowdstrikeTable", () => {
  beforeEach(async () => {
    render(<App />);
    await waitForTable();
    await waitForRows();
  });

  it("renders the Crowdstrike table", async () => {});

  it("renders the Crowdstrike table with data", async () => {
    await waitForRows();
  });

  it("should select all rows", async () => {
    await waitForRows();

    const selectAllCheckbox = screen.getByTestId("crowdstrike-global-checkbox");
    selectAllCheckbox.click();

    await waitFor(
      () => {
        expect(
          screen.getAllByRole("checkbox", { checked: true }).length
        ).toBeGreaterThan(0);
      },
      { timeout: 3000 }
    );
  });

  it("should disable download button when none available row with status are selected", async () => {
    await waitForRows();

    const downloadButton = screen.getByText("Download Selected");
    expect(downloadButton).toBeDisabled();
  });

  it("should enable download button when available row with status are selected", async () => {
    await waitForRows();

    const tbody = await getTbody();

    const tbodyCheckboxes = within(tbody!).getAllByRole("checkbox");

    const secondRowCheckbox = tbodyCheckboxes[1];
    secondRowCheckbox.click();

    const downloadButton = screen.getByText("Download Selected");
    expect(downloadButton).toBeEnabled();
  });

  it("should show indeterminate checkbox when some rows are selected", async () => {
    await waitForRows();

    const tbody = await getTbody();

    const tbodyCheckboxes = within(tbody!).getAllByRole("checkbox");

    const secondRowCheckbox = tbodyCheckboxes[0];
    secondRowCheckbox.click();

    const globalCheckbox = screen.getByTestId("crowdstrike-global-checkbox");
    expect(globalCheckbox).toHaveProperty("indeterminate", true);
  });

  it("should update the selected count span when rows are selected", async () => {
    await waitForRows();

    const tbody = await getTbody();

    const tbodyCheckboxes = within(tbody!).getAllByRole("checkbox");

    const secondRowCheckbox = tbodyCheckboxes[0];
    secondRowCheckbox.click();

    const selectedCountSpan = screen.getByTestId("crowdstrike-selected-count");
    expect(selectedCountSpan).toHaveTextContent("Selected 1");
  });

  it("should show circle green icon when status is available", async () => {
    await waitForRows();

    const tbody = await getTbody();

    const tbodyRows = within(tbody!).getAllByTestId("crowdstrike-row");

    const firstRow = tbodyRows[1];

    const availableCircle = within(firstRow).getByTestId("available-circle");
    expect(availableCircle).toBeInTheDocument();
  });

  it("should show alert with selected paths when download button is clicked", async () => {
    window.alert = vi.fn();

    await waitForRows();

    const tbody = await getTbody();

    const tbodyCheckboxes = within(tbody!).getAllByRole("checkbox");

    const secondRowCheckbox = tbodyCheckboxes[1];
    secondRowCheckbox.click();

    const downloadButton = screen.getByText("Download Selected");
    downloadButton.click();

    await waitFor(() => {
      expect(window.alert).toBeCalledWith(
        "Downloading: \\Device\\HarddiskVolume2\\Windows\\System32\\netsh.exe"
      );
    });
  });
});
