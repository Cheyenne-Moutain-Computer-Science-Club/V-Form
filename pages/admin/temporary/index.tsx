import EditDropdownTypeSheet from '@/components/questionTypes/editable/EditDropdownFromSheet'
import React from 'react'

export default function Temp() {
  return (
    <>
      <EditDropdownTypeSheet 
        items={["a", "Op b", "OP3"]}
        title={"This is a title"}
        required={false}
        id={8}
        update={() => console.log("Updated")}
        description="This is a description"
        placeholder="Placeholder"
      />
    </>
  )
}