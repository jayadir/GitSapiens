import React from 'react'
import GroupChat from '../../../../components/GroupChat'
export default function page({params}) {

  return (
    <div>
      <GroupChat groupId={params.id}/>
    </div>
  )
}
