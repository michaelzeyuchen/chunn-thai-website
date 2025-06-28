"use client"

import React from 'react'
import WorkingLeaf from './WorkingLeaf'

const BasicHerb = () => {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 9999 }}>
      {/* Test with simple working leaves */}
      <WorkingLeaf index={0} />
      <WorkingLeaf index={1} />
      <WorkingLeaf index={2} />
      <WorkingLeaf index={3} />
      <WorkingLeaf index={4} />
    </div>
  )
}

export default BasicHerb