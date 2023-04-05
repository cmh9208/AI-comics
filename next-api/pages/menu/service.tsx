import React from 'react'
import ChatbotModel from '@/components/menu/services/ChatbotModel';
import GanFace from '@/components/menu/services/GanFace';
import GanStandard from '@/components/menu/services/GanStandard';
import GanVideo from '@/components/menu/services/GanVideo';
import Paint from '@/components/menu/services/Paint';
import AddSticker from '@/components/menu/services/AddSticker';
const ServicePage = () => {
  return (
    <div>
      <GanFace/>
      <br/>
      <GanStandard/>
      <br/>
      <GanVideo/>
      <br/>
      <ChatbotModel/>
      <br/>
      <Paint/>
      <br/>
      <AddSticker/>
    </div>
      
  )
}

export default ServicePage