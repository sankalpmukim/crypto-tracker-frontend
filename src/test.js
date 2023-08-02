"use client";
import * as React from "react";
import Table from "@cloudscape-design/components/table";
import Box from "@cloudscape-design/components/box";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import TextFilter from "@cloudscape-design/components/text-filter";
import Header from "@cloudscape-design/components/header";
import Pagination from "@cloudscape-design/components/pagination";
import CollectionPreferences from "@cloudscape-design/components/collection-preferences";
import { Link } from "@cloudscape-design/components";
import { useCollection } from "@cloudscape-design/collection-hooks";

const allItems = [
  {
    name: "Item 1",
    alt: "First",
    description: "This is the first item",
    type: "1A",
    size: "Small",
  },
  {
    name: "Item 2",
    alt: "Second",
    description: "This is the second item",
    type: "1B",
    size: "Large",
  },
  { name: "Item 3", alt: "Third", description: "-", type: "1A", size: "Large" },
  {
    name: "Item 4",
    alt: "Fourth",
    description: "This is the fourth item",
    type: "2A",
    size: "Small",
  },
  {
    name: "Item 5",
    alt: "-",
    description: "This is the fifth item with a longer description",
    type: "2A",
    size: "Large",
  },
  {
    name: "Item 6",
    alt: "Sixth",
    description: "This is the sixth item",
    type: "1A",
    size: "Small",
  },
];

function EmptyState({ title, subtitle, action }) {
  return (
    <Box textAlign="center" color="inherit">
      <Box variant="strong" textAlign="center" color="inherit">
        {title}
      </Box>
      <Box variant="p" padding={{ bottom: "s" }} color="inherit">
        {subtitle}
      </Box>
      {action}
    </Box>
  );
}

export function getMatchesCountText(count) {
  return count === 1 ? `1 match` : `${count} matches`;
}

function formatDate(date) {
  const dateFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "long" });
  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    timeStyle: "short",
    hour12: false,
  });
  return `${dateFormatter.format(date)}, ${timeFormatter.format(date)}`;
}

function createLabelFunction(columnName) {
  return ({ sorted, descending }) => {
    const sortState = sorted
      ? `sorted ${descending ? "descending" : "ascending"}`
      : "not sorted";
    return `${columnName}, ${sortState}.`;
  };
}

export const columnDefinitions = [
  {
    id: "id",
    header: "ID",
    cell: (item) => <Link href={`#${item.id}`}>{item.id}</Link>,
    ariaLabel: createLabelFunction("id"),
    sortingField: "id",
    isRowHeader: true,
  },
  {
    id: "availabilityZone",
    header: "Availability zone",
    cell: (item) => item.availabilityZone,
    ariaLabel: createLabelFunction("Availability zone"),
    sortingField: "availabilityZone",
  },
  {
    id: "state",
    header: "State",
    cell: (item) => item.state,
    ariaLabel: createLabelFunction("State"),
    sortingField: "state",
  },
  {
    id: "lastModifield",
    header: "Last modified",
    cell: (item) => formatDate(item.lastModified),
    ariaLabel: createLabelFunction("Last modified"),
    sortingComparator: (a, b) =>
      a.lastModified.valueOf() - b.lastModified.valueOf(),
  },
];

export const paginationLabels = {
  nextPageLabel: "Next page",
  pageLabel: (pageNumber) => `Go to page ${pageNumber}`,
  previousPageLabel: "Previous page",
};

const pageSizePreference = {
  title: "Select page size",
  options: [
    { value: 10, label: "10 resources" },
    { value: 20, label: "20 resources" },
  ],
};

const visibleContentPreference = {
  title: "Select visible content",
  options: [
    {
      label: "Main properties",
      options: columnDefinitions.map(({ id, header }) => ({
        id,
        label: header,
        editable: id !== "id",
      })),
    },
  ],
};
export const collectionPreferencesProps = {
  pageSizePreference,
  visibleContentPreference,
  cancelLabel: "Cancel",
  confirmLabel: "Confirm",
  title: "Preferences",
};

export default function Test() {
  const [filteringText, setFilteringText] = React.useState("");

  React.useEffect(() => {}, [filteringText]);
  const [preferences, setPreferences] = React.useState({
    pageSize: 10,
    visibleContent: ["id", "availabilityZone", "state"],
  });
  const {
    items,
    actions,
    filteredItemsCount,
    collectionProps,
    filterProps,
    paginationProps,
  } = useCollection(allItems, {
    filtering: {
      empty: (
        <EmptyState
          title="No instances"
          action={<Button>Create instance</Button>}
        />
      ),
      noMatch: (
        <EmptyState
          title="No matches"
          action={
            <Button onClick={() => actions.setFiltering("")}>
              Clear filter
            </Button>
          }
        />
      ),
    },
    pagination: { pageSize: preferences.pageSize },
    sorting: {},
    selection: {},
  });
  const { selectedItems } = collectionProps;
  return (
    <Table
      {...collectionProps}
      selectionType="multi"
      header={
        <Header
          counter={
            selectedItems.length
              ? `(${selectedItems.length}/${allItems.length})`
              : `(${allItems.length})`
          }
        >
          Instances
        </Header>
      }
      columnDefinitions={columnDefinitions}
      visibleColumns={preferences.visibleContent}
      items={items}
      pagination={
        <Pagination {...paginationProps} ariaLabels={paginationLabels} />
      }
      filter={
        <TextFilter
          {...filterProps}
          countText={getMatchesCountText(filteredItemsCount)}
          filteringAriaLabel="Filter instances"
        />
      }
      preferences={
        <CollectionPreferences
          {...collectionPreferencesProps}
          preferences={preferences}
          onConfirm={({ detail }) => setPreferences(detail)}
        />
      }
    />
  );
}
