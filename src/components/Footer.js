import React from 'react'

import { 
  Text,
  Box,
  Image,
} from 'grommet';
import {Twitter} from 'grommet-icons';
import discordLogo from '../assets/discordLogoWhite.png';
import telegramLogo from '../assets/telegramLogoWhite.png';

const Footer = () => {
  return (
    <Box
      flex
      align='end'
      as='footer'
      direction='row'
      gap='medium'
      justify='around'
    >
      <Text color='white'>CatNIP © 2021</Text>
      <Box direction='row' gap='xsmall'>
        <Twitter color='white'/>
        <Image width={24} height='auto' src={discordLogo}/>
        <Image width={24} height='auto' src={telegramLogo}/>
      </Box>
    </Box>
  )
}

export default Footer
