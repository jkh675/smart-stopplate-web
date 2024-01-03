"use client"
// import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Button from '@mui/material/Button';
import React from 'react';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import { ButtonProps, CssBaseline, Paper, ThemeProvider, createTheme, useTheme } from '@mui/material';
import { ThemeOptions } from '@mui/material/styles';
import { HomeOutlined, ArrowBack, Menu, PeopleOutlined, SnippetFolderOutlined, HourglassBottomOutlined } from '@mui/icons-material';
import { ROUTE_LIST } from '../constant';
import Link from 'next/link';
import Stack from '@mui/material/Stack';
import { ApolloProvider, ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { SchemaLink } from '@apollo/client/link/schema';

import { BLEStopplateService } from "@/ble_service";


const inter = Inter({ subsets: ['latin'] })

// export const metadata: Metadata = {
// 	title: 'Create Next App',
// 	description: 'Generated by create next app',
// }


const Drawer = () => {
	const [open, setOpen] = React.useState(false);


	const MenuButton = (props: ButtonProps) => {
		return open ?
			<Button style={{
				height: "3rem",
				justifyContent: "right",
				width: "100%",
			}} {...props} /> :
			<Button style={{
				height: "3rem",
			}} sx={{ ".MuiButton-endIcon": { margin: 0 } }} {...props}><></></Button>
	}

	React.useMemo(() => {
		BLEStopplateService.getInstance();
	}, [])

	return <Paper elevation={10} style={{ height: "100vh" }}>
		<ButtonGroup orientation="vertical" style={{ margin: 10 }}>
			<MenuButton variant='contained' endIcon={open ? <ArrowBack /> : <Menu />} onClick={() => setOpen(!open)}>Collapse</MenuButton>
			{ROUTE_LIST.map((v, i) => v.show_on_sidebar ? <Link key={i} href={`${v.dir}`}><MenuButton variant='outlined' endIcon={<v.icon />}>
				{v.display_name}
			</MenuButton></Link> : null)}
		</ButtonGroup>
	</Paper>
}


export const themeOptions: ThemeOptions = createTheme({
	palette: {
		mode: 'dark',
	},
	typography: {
		button: {
			textTransform: 'none'
		}
	}
});




const client = new ApolloClient({
	uri: "https://192.168.0.126:8081/",
	cache: new InMemoryCache(),
});


export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const theme = useTheme();
	return (
		<html lang="en">
			<head>
				<meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
			</head>
			<body className={inter.className}>
				<ThemeProvider theme={themeOptions}>
					<CssBaseline />
					<ApolloProvider client={client}>
						<Paper>
							<Stack direction={"row"}>
								<Drawer />
								<Box component="main" sx={{ flexGrow: 1, p: 3, overflow: "auto", height: "100vh", scrollBehavior: "auto" }}>
									{children}
								</Box>
							</Stack>
						</Paper>
					</ApolloProvider>
				</ThemeProvider>
			</body>
		</html>

	)
}
