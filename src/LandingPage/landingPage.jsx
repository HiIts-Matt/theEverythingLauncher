import { Center, Drawer, Stack, Button, Group, Text, Grid, Box} from '@mantine/core';
import React, { useState } from 'react';

function LandingPage(){

    const [functions, setFunctions] = useState([])
    const [drawerOpened, setDrawerOpened] = useState(false);

    return(
        <Stack gap='0px'>
            <Header/>
            <MainGrid 
                h="calc(100vh - 60px)"
                functions={functions}
                onAddClick={() => setDrawerOpened(true)}
            />
            <Drawer
                size="lg"
                opened={drawerOpened}
                onClose={() => setDrawerOpened(false)}
                title="Create New Function"
                overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
                offset={8} 
                radius="lg"
                c="white"
                styles={{ 
                    border: '1px solid rgb(100,100,100)',
                    header: {
                        backgroundColor: 'rgb(30,30,30)',
                        padding: '10px 20px',
                    },
                    body: { 
                        backgroundColor: 'rgb(40,40,40)',
                        padding: '20px',
                    }
                }}
            >
                <Text c='white'>Function creation form goes here.</Text>
            </Drawer>
        </Stack>
    );
}

function Header (){

    return (
        <Box 
            h='60px'
            bg='rgb(30,30,30)' 
            p='10px' 
            style={{ borderBottom: '1px solid rgb(100,100,100)' }}
        >
            <Group w='100%' justify='space-between'> 
                <Text c='white' size="xl" fw={700}>
                    <i>The Everything Launcher</i>
                </Text>
                <Text size="md" c="dimmed">
                    <Button color="blue">Test Button</Button>
                </Text>
            </Group>
        </Box>
        
    );
}

function MainGrid({functions, onAddClick}){

    return (
        <Box p="20px" bg="rgb(30,30,30)" h="calc(100vh - 60px)">
            <Grid>
                {functions.length === 0 ? (
                    <Grid.Col span={12}>
                        <Center>
                            <Button
                                color="blue"
                                size="xl"
                                radius="xl"
                                onClick={onAddClick}
                                style={{ fontSize: 32, width: 64, height: 64, padding: 0 }}
                            >
                                +
                            </Button>
                        </Center>
                        <Text c="white" align="center" mt="md">
                            No items yet. Apps, Folders, and Components will appear here.
                        </Text>
                    </Grid.Col>
                ) : (
                    functions.map((item, idx) => (
                        <Grid.Col key={idx} span={4}>
                            <Box
                                bg="rgb(40,40,40)"
                                p="md"
                                style={{
                                    borderRadius: 8,
                                    border: "1px solid rgb(60,60,60)",
                                    minHeight: 100,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Text c="white" fw={700}>
                                    {item.type || "Unknown"}
                                </Text>
                                <Text c="dimmed" size="sm">
                                    {item.name || "Unnamed"}
                                </Text>
                            </Box>
                        </Grid.Col>
                    ))
                )}
            </Grid>
        </Box>
    );
}

export default LandingPage;