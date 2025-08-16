"use client";

import React, { MouseEventHandler } from 'react'

export const Button = ({children, className, onClick}: {children: string, className: string, onClick: MouseEventHandler<HTMLButtonElement> | undefined}) => {
  return (
    <button className={className} onClick={onClick}>{children}</button>
  )
}
