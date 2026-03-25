'use client'

import React from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

// Main Accordion
function AccordionMain({ children, ...props }) {
  return <Accordion.Root {...props}>{children}</Accordion.Root>;
}

// Accordion Item
function AccordionItem({ children, ...props }) {
  return (
    <Accordion.Item
      style={{ borderBottom: "1px solid #ccc" }}
      {...props}
    >
      {children}
    </Accordion.Item>
  );
}

// Accordion Trigger (clickable heading)
function AccordionTrigger({ children, ...props }) {
  return (
    <Accordion.Header>
      <Accordion.Trigger
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          padding: "10px",
          cursor: "pointer",
        }}
        {...props}
      >
        {children}
        <ChevronDown size={16} />
      </Accordion.Trigger>
    </Accordion.Header>
  );
}

// Accordion Content (hidden part)
function AccordionContent({ children, ...props }) {
  return (
    <Accordion.Content
      style={{
        padding: "10px",
        fontSize: "14px",
      }}
      {...props}
    >
      {children}
    </Accordion.Content>
  );
}

// Export components
export {
  AccordionMain,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
};