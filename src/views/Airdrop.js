import React, {useState, useEffect} from 'react'
import { 
  Image,
  Heading,
  Paragraph,
  ResponsiveContext,
  Box,
  Stack,
} from 'grommet';
import BackgroundBox from '../components/Background';
import PrimaryButton from '../components/PrimaryButton';
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import lepCat from '../assets/lepurrchaun.png';
import leaf from '../assets/leafTeal.png';
import Menu from '../components/Menu';
import { Scrollbars } from 'react-custom-scrollbars';

import detectEthereumProvider from '@metamask/detect-provider'
import Web3 from 'web3';

import configData from '../config.json';

const Airdrop = (props) => {
  const [metaMaskAddress, setMetaMaskAddress] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [airDropContract, setAirDropContract] = useState(null);
  const [total, setTotal] = useState(null);
  const [allClaimed, setAllClaimed] = useState(null);
  const [leftToClaim, setLeftToClaim] = useState(null);
  const [partialClaimed, setPartialClaimed] = useState(null);


  const initWeb3 = async () => {
    console.log("[web3] getting provider...");
    const provider = await detectEthereumProvider()
    if (provider) {
      console.log('Ethereum successfully detected!');
    }else {
        alert("You have to use Trustwallet app or install Metamask extension in your browser to use this app, you can install it from :  https://metamask.io");
        return;
    }
    
    let web3 = new Web3(provider);

    console.log("[web3] got provider!");
    //set state
    setWeb3(web3);
    
    const id = await web3.eth.net.getId();

    const contract = new web3.eth.Contract(configData.abi, configData.address);
    setAirDropContract(contract);
  }

  const connectWallet = async () => {
    // Set default account 
    let accounts = await web3.givenProvider.request({ method: 'eth_requestAccounts' });
    setMetaMaskAddress(accounts[0]);
    airDropContract.methods.airDropTokensTotal(accounts[0]).call().then((result) => {setTotal(result)});
    airDropContract.methods.airDropTokensAllClaimed(accounts[0]).call().then((result) => {setAllClaimed(result)});
    airDropContract.methods.airDropTokensLeftToClaim(accounts[0]).call().then((result) => {setLeftToClaim(result)});
    airDropContract.methods.airDropTokensPartialClaimed(accounts[0]).call().then((result) => {setPartialClaimed(result)});
  }

  const claimAirdrop = async () => {
    await airDropContract.methods.airDropClaim()
      .send({
        from: metaMaskAddress
      })
      .once('receipt', (receipt) => {
        const amountOfAirDropLeft = 10;
        let stringBuildForAirdropAmount = "You have claimed your airdrop! For now, you now have " + amountOfAirDropLeft + " NIP to claim."
        console.log(stringBuildForAirdropAmount);
      });
  }

  useEffect(() => {
    initWeb3();
  },[]);

  return (
    <ResponsiveContext.Consumer>
    {size => (
      <BackgroundBox>
        <NavBar sideBarOpen={props.sideBarOpen} setSideBarOpen={props.setSideBarOpen}/>
        <Stack>
          <Menu sideBarOpen={props.sideBarOpen}/>
          <Box
            direction='column'
            align='center'
            overflow={{ vertical: 'hidden', horizontal: 'hidden' }}
            height='100vh'
          >
            <Image alt="..." style={{width: `${size !== 'small' ? '12%' : '50%'}`, height: 'auto'}} src={lepCat}/>
            <Heading color='white' style={{margin: '0px'}}>CATNIP AIRDROP</Heading>
            <Paragraph fill size='large' textAlign='center' color='white'>Do you have an airdrop? Click "Connect to CatNIP" to see!</Paragraph>
            <Box 
              direction='column' 
                align='center'
                justify='center'
                flex="grow"
                style={{
                padding: '15px', 
                
                borderRadius: "30px",
                background: "rgba(0, 0, 0, 0.1)",}}
            >
              <Paragraph color='white'>Total Airdrop Amount: {total}</Paragraph>
              
              <Paragraph color='white'>Airdrop Left to Claim: {leftToClaim}</Paragraph>
              
              <Paragraph color='white'>Airdrop available to Claim: </Paragraph>
            </Box>
          <Box direction={size != 'small' ? 'row' : 'column'} margin='large'>
            <PrimaryButton onClick={connectWallet} greyedOut={false} image={leaf} name={metaMaskAddress ? `${metaMaskAddress.substring(0,8)}...` : 'Connect to CatNIP'}/>
            <PrimaryButton onClick={claimAirdrop} greyedOut={metaMaskAddress ? false : true} image={leaf} name='Claim Airdrop'/>
          </Box>
          <Paragraph size='large' textAlign='center' color='white'>Check back next week for more Airdrop to Claim!</Paragraph>
          </Box>
        </Stack>
        <Footer/>
      </BackgroundBox>
    )}
    </ResponsiveContext.Consumer>
  )
}

export default Airdrop