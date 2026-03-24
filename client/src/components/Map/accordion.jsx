'use client'

import React from 'react'
import * as Accordion from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'

// Simple Accordion wrapper
function AccordionMain(props) {
  return <Accordion.Root {...props}></Accordion.Root>
}

// Accordion Item
function AccordionItem(props) {
  return (
    <Accordion.Item
      style={{ borderBottom: '1px solid #ccc' }}
      {...props}
    >
      {props.children}
    </Accordion.Item>
  )
}

// Accordion Trigger (clickable part)
function AccordionTrigger(props) {
  return (
    <Accordion.Header>
      <Accordion.Trigger
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          padding: '10px',
          cursor: 'pointer',
        }}
        {...props}
      >
        <span>{props.children}</span>
        <ChevronDown size={16} />
      </Accordion.Trigger>
    </Accordion.Header>
  )
}

// Accordion Content
function AccordionContent(props) {
  return (
    <Accordion.Content
      style={{
        padding: '10px',
        fontSize: '14px',
      }}
      {...props}
    >
      {props.children}
    </Accordion.Content>
  )
}

// Export all components
export {
  AccordionMain,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
}