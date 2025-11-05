"use client";

import Form from "next/form";
import { useCallback, useRef, useState, useTransition } from "react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Icon } from "@/components/ui/icon";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useUrlState } from "@/app/hooks/use-url-state";

export const SearchForm = () => {
  const debounceRef = useRef<NodeJS.Timeout>(undefined);
  const [isPending, startTransition] = useTransition();
  const [isDebouncing, setIsDebouncing] = useState(false);
  const { getParam, updateURL } = useUrlState();

  const urlQuery = getParam("query", "");
  const [value, setValue] = useState(urlQuery);

  const debounce = useCallback((fn: () => void, delay = 500) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fn, delay);
  }, []);

  const handleInputChange = (value: string) => {
    const trimmed = value.trimStart();
    if (trimmed === urlQuery) return;

    setValue(trimmed);
    setIsDebouncing(true);
    clearTimeout(debounceRef.current);

    debounce(() => {
      setIsDebouncing(false);
      startTransition(() => {
        updateURL({ query: trimmed || null, page: null });
      });
    });
  };

  const handleClear = () => {
    clearTimeout(debounceRef.current);
    setIsDebouncing(false);
    startTransition(() => {
      setValue("");
      updateURL({ query: null, page: null });
    });
  };

  const showAddon = isPending || isDebouncing || Boolean(value);

  return (
    <Form action="" className="w-full max-w-xs">
      <InputGroup className="border-border-300 dark:border-border">
        <InputGroupAddon align="inline-start" className="pr-1">
          <Label htmlFor="search">
            <Icon name="search" className="*:stroke-muted-foreground" />
            <span className="sr-only">Search</span>
          </Label>
        </InputGroupAddon>
        <InputGroupInput
          name="query"
          value={value}
          className="max-sm:h-10"
          placeholder="Search Bookmarks"
          onChange={(e) => handleInputChange(e.target.value)}
        />
        <InputGroupAddon align="inline-end" className={!showAddon ? "hidden" : ""}>
          {isPending || isDebouncing ? (
            <Spinner />
          ) : value ? (
            <InputGroupButton
              type="reset"
              variant={"secondary"}
              aria-label="Clear search"
              onClick={handleClear}
              className="size-7 rounded-xs"
            >
              <Icon name="close" className="*:stroke-muted-foreground scale-90" />
            </InputGroupButton>
          ) : null}
        </InputGroupAddon>
      </InputGroup>
    </Form>
  );
};
