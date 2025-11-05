"use client";

import Form from "next/form";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Icon } from "@/components/ui/icon";
import { Label } from "@/components/ui/label";
import { useUrlState } from "@/app/hooks/use-url-state";

export const SearchForm = () => {
  const { getParam, updateURL } = useUrlState();
  const query = getParam("query") || "";

  return (
    <Form action="/dashboard" className="w-full max-w-xs">
      <InputGroup className="border-border-300 dark:border-border">
        <InputGroupAddon align="inline-start" className="pr-1">
          <Label htmlFor="search">
            <Icon name="search" className="*:stroke-muted-foreground" />
            <span className="sr-only">Search</span>
          </Label>
        </InputGroupAddon>
        <InputGroupInput name="query" placeholder="Search Bookmarks" className="max-sm:h-10" />
        {query && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              variant={"secondary"}
              type="reset"
              aria-label="Clear search"
              onClick={() => updateURL({ query: "" })}
              className="h-7 w-7 rounded-none"
            >
              <Icon name="close" className="*:stroke-muted-foreground scale-90" />
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>
    </Form>
  );
};
