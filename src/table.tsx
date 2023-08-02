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
import banner from "./banner.tsx";

let allItems = [
  {
    id: "1",
    coinName: "Bitcoin",
    lastPrice: "$ 10,000",
    // yourMin: "$ 9,000",
    yourMax: "$ 11,000",
  },
  {
    id: "2",
    coinName: "Ethereum",
    lastPrice: "$ 1,000",
    yourMin: "$ 900",
    yourMax: "$ 1,100",
  },
  {
    id: "3",
    coinName: "Litecoin",
    lastPrice: "$ 100",
    yourMin: "$ 90",
    yourMax: "$ 110",
  },
  {
    id: "4",
    coinName: "Ripple",
    lastPrice: "$ 10",
    yourMin: "$ 9",
    yourMax: "$ 11",
  },
  {
    id: "5",
    coinName: "Bitcoin Cash",
    lastPrice: "$ 1",
    yourMin: "$ 0.9",
    yourMax: "$ 1.1",
  },
  {
    id: "6",
    coinName: "Bitcoin SV",
    lastPrice: "$ 0.1",
    yourMin: "$ 0.09",
    yourMax: "$ 0.11",
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
    header: "S.No.",
    cell: (item) => item.id,
    ariaLabel: createLabelFunction("S.No."),
    sortingField: "id",
    isRowHeader: true,
  },
  {
    id: "name",
    header: "Coin Name",
    cell: (item) => item.coinName,
    ariaLabel: createLabelFunction("Coin Name"),
    sortingField: "name",
  },
  {
    id: "lastPrice",
    header: "Last Price",
    cell: (item) => item.lastPrice,
    ariaLabel: createLabelFunction("Last Price"),
    sortingField: "lastPrice",
  },
  {
    id: "yourMin",
    header: "Your Min",
    cell: (item) => item.yourMin,
    ariaLabel: createLabelFunction("Your Min"),
    sortingComparator: (a, b) => a - b,
  },
  {
    id: "yourMax",
    header: "Your Max",
    cell: (item) => item.yourMax,
    ariaLabel: createLabelFunction("Your Max"),
    sortingComparator: (a, b) => a - b,
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
    { value: 10, label: "10 Coins" },
    { value: 20, label: "20 Coins" },
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
        // editable: id !== "id",
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

export default function TableC() {
  const [allItems, setAllItems] = React.useState<
    [
      {
        id: string;
        coinName: string;
        lastPrice: number;
        yourMin: number;
        yourMax: number;
      }
    ]
  >([]);

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);
    fetch("https://cryptotracker-api.sankalpmukim.dev/users/coins", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setAllItems(data.userCoins);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const [preferences, setPreferences] = React.useState({
    pageSize: 10,
    visibleContent: [
      "id",
      "name",
      "yourMin",
      "lastPrice",
      "yourMin",
      "yourMax",
    ],
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
          title="No coins found"
          action={<Button>Search Coins</Button>}
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
    <div>
      {banner()}
      <Table
        {...collectionProps}
        // selectionType=""
        // header={
        // <Header
        //   counter={
        //     selectedItems?.length
        //       ? `(${selectedItems.length}/${allItems.length})`
        //       : `(${allItems.length})`
        //   }
        // >
        //   CryptoCurrencies
        // </Header>
        // banner
        // }
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
            filteringAriaLabel="Filter Coins"
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
    </div>
  );
}
