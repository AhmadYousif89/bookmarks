"use client";

import { useState, useEffect, useRef } from "react";

import { cn } from "@/lib/utils";
import { TBookmark } from "@/lib/types";
import { PREDEFINED_TAGS } from "../_lib/config";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

const MAX_TAGS = 4;

type TagsInputProps = {
  error: boolean;
  value: TBookmark["tags"];
  onChange: (tags: string[]) => void;
  errorMessage: string;
  onClearError?: () => void;
};

export const TagsInput = ({
  value,
  error,
  errorMessage,
  onClearError,
  onChange,
}: TagsInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>(value || []);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  // Flag to indicate changes originated from user interaction inside this component.
  const isInternalChange = useRef(false);

  // Notify parent of selected tags change
  useEffect(() => {
    if (isInternalChange.current) {
      onChange(selectedTags);
      isInternalChange.current = false;
    }
  }, [selectedTags, onChange]);
  // Sync internal state when parent-provided tags change (e.g., after a failed submit)
  useEffect(() => {
    setSelectedTags(value);
  }, [JSON.stringify(value)]);
  // Close suggestions on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setHighlightedIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // Filter suggestions based on input - handles multi-keyword after comma
  useEffect(() => {
    if (inputValue.trim()) {
      // Get the last keyword after comma for filtering
      const lastKeyword = inputValue.split(",").pop()?.trim().toLowerCase() || "";
      const filtered = PREDEFINED_TAGS.filter(
        (tag) => tag.toLowerCase().includes(lastKeyword) && !selectedTags.includes(tag),
      );
      setSuggestions(filtered);
      setHighlightedIndex(-1);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputValue, selectedTags]);
  // Scroll highlighted item into view when navigating
  useEffect(() => {
    if (highlightedIndex < 0) return;
    const el = listRef.current?.querySelector(
      `[data-idx="${highlightedIndex}"]`,
    ) as HTMLElement | null;
    el?.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex, showSuggestions]);

  const capacityLeft = Math.max(0, MAX_TAGS - selectedTags.length);

  const processInput = (value: string) => {
    if (capacityLeft === 0) return;
    const parts = value.split(",");
    const lastPart = parts.pop() ?? "";
    const toCommit = parts
      .map((p) => p.trim())
      .filter((t) => t && !selectedTags.includes(t) && t.length > 0)
      .slice(0, capacityLeft);

    if (toCommit.length) {
      setSelectedTags((prev) => [...prev, ...toCommit]);
    }
    setInputValue(lastPart);
  };

  const addTag = (tag: string) => {
    const normalized = tag.trim();
    if (!normalized || selectedTags.includes(normalized) || selectedTags.length >= MAX_TAGS) return;
    setSelectedTags((prev) => [...prev, normalized]);
    setInputValue("");
    setShowSuggestions(false);
    onClearError?.();
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tagToRemove));
    // Defer focus to ensure DOM updates after state change
    // this is needed to avoid focus loss after having the max number of tags
    // and trying to remove a tag
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onClearError?.();
    if (value.includes(",")) {
      processInput(value);
    } else {
      setInputValue(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          addTag(suggestions[highlightedIndex]);
        } else if (inputValue.trim()) {
          addTag(inputValue);
        }
        break;
      case "ArrowDown":
      case "ArrowRight":
        if (suggestions.length === 0) return;
        e.preventDefault();
        setHighlightedIndex((prev) => {
          const next = prev + 1;
          return next >= suggestions.length ? 0 : next; // wrap
        });
        break;
      case "ArrowUp":
      case "ArrowLeft":
        if (suggestions.length === 0) return;
        e.preventDefault();
        setHighlightedIndex((prev) => {
          if (prev <= 0) return suggestions.length - 1; // wrap
          return prev - 1;
        });
        break;
      case "Backspace":
        if (!inputValue && selectedTags.length > 0) {
          removeTag(selectedTags[selectedTags.length - 1]);
        }
        break;
      default:
        break;
    }
  };

  const handleInputFocus = () => {
    onClearError?.();
    if (suggestions.length > 0) setShowSuggestions(true);
  };

  const hiddenValue = selectedTags.join(", ");

  return (
    <Field ref={containerRef} className="relative gap-1.5 *:[label]:w-fit">
      <FieldLabel htmlFor="tags" className="text-foreground gap-0.5 text-sm font-semibold">
        Tags <span className="text-primary dark:text-muted-foreground">*</span>
      </FieldLabel>

      {/* Collected Tags as Hidden Input */}
      <input type="hidden" name="tags" value={hiddenValue} required />

      {/* Tags and Input Container */}
      <InputGroup>
        <InputGroupAddon
          align="block-start"
          className={cn(
            "flex overflow-x-auto transition-all max-sm:flex-nowrap",
            selectedTags.length === 0
              ? "pointer-events-none invisible px-0 opacity-0 group-has-[>input]/input-group:pt-0"
              : "ease visible min-h-7 border-b opacity-100 duration-200",
          )}
        >
          {selectedTags.map((tag) => (
            <div
              key={tag}
              className="bg-background text-muted-foreground flex items-center gap-2 rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap sm:text-sm"
            >
              {tag}
              <Button
                type="button"
                variant="destructive"
                className="size-3.5 p-1.5"
                onClick={() => removeTag(tag)}
                aria-label={`Remove ${tag}`}
              >
                <Icon name="close" className="*:stroke-primary-foreground scale-65" />
              </Button>
            </div>
          ))}
        </InputGroupAddon>
        <InputGroupInput
          id="tags"
          ref={inputRef}
          required={selectedTags.length === 0}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          disabled={capacityLeft === 0}
          placeholder="e.g. Design, Learning, Tools"
          aria-autocomplete="list"
          aria-controls="tags-suggestions"
          aria-invalid={error}
          aria-describedby={error ? "tags-error" : undefined}
        />
        {error && (
          <InputGroupAddon align="block-end" className="border-t">
            <InputGroupButton
              type="button"
              variant="destructive"
              className="size-4 py-2"
              onClick={onClearError}
              aria-label="Dismiss tags error"
            >
              <Icon name="close" className="*:stroke-primary-foreground scale-75" />
            </InputGroupButton>
            <FieldError id="tags-error" className="text-sm/normal font-medium tracking-tight">
              {errorMessage}
            </FieldError>
          </InputGroupAddon>
        )}
      </InputGroup>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={listRef}
          role="listbox"
          id="tags-suggestions"
          className="bg-card border-border-100 dark:border-border-300 absolute top-full right-0 left-0 z-10 mt-1 flex max-h-20 flex-wrap gap-1 overflow-y-auto rounded-md border p-0.5 shadow-lg"
        >
          {suggestions.map((tag, index) => (
            <button
              key={tag}
              type="button"
              role="option"
              aria-selected={index === highlightedIndex}
              data-idx={index}
              className={cn(
                "hover:bg-accent hover:text-foreground border border-dashed px-3 py-2 text-left text-xs font-medium transition-colors duration-200 ease-out",
                index === highlightedIndex ? "bg-accent text-foreground" : "text-muted-foreground",
              )}
              onClick={() => addTag(tag)}
              onMouseDown={(e) => e.preventDefault()}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </Field>
  );
};
