'use client'

import React from 'react'

// Main Card
function Card(props) {
  return (
    <div
      style={{
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: '10px',
        padding: '15px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        marginBottom: '15px',
      }}
    >
      {props.children}
    </div>
  )
}

// Card Header
function CardHeader(props) {
  return (
    <div style={{ marginBottom: '10px' }}>
      {props.children}
    </div>
  )
}

// Card Title
function CardTitle(props) {
  return (
    <h3 style={{ margin: 0 }}>
      {props.children}
    </h3>
  )
}

// Card Description
function CardDescription(props) {
  return (
    <p style={{ fontSize: '14px', color: 'gray' }}>
      {props.children}
    </p>
  )
}

// Card Content
function CardContent(props) {
  return (
    <div style={{ marginTop: '10px' }}>
      {props.children}
    </div>
  )
}

// Card Footer
function CardFooter(props) {
  return (
    <div style={{ marginTop: '10px' }}>
      {props.children}
    </div>
  )
}

// Card Action (like button area)
function CardAction(props) {
  return (
    <div style={{ textAlign: 'right' }}>
      {props.children}
    </div>
  )
}

// Export all components
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
}