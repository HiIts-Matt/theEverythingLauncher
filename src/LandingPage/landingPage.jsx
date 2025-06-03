import { Center, Stack, Button, Group, Text, Paper, Box, Code, Container, LoadingOverlay } from '@mantine/core';
import React, { useEffect, useState, useRef } from 'react';

function LandingPage() {
    const [isShuffling, setIsShuffling] = useState(false);
    const [data, setData] = useState({
        current: [],
        stats: { correctPositions: 0, totalDisplacement: 0 },
        best: { deck: [], displacement: Infinity, correctPositions: 0 },
    });
    const [shuffleCount, setShuffleCount] = useState(0);
    const stopRef = useRef(false);

    const bestShuffleRef = useRef([]);
    const bestDisplacementRef = useRef(Infinity);
    const bestCorrectPositionsRef = useRef(0);

    useEffect(() => {
        if (!isShuffling) return;
        stopRef.current = false;

        const sortedDeck = [...Array(52).keys()];

        function shuffle(array) {
            return array
                .map((val) => ({ val, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(({ val }) => val);
        }

        function getStats(deck) {
            let correctPositions = 0;
            let totalDisplacement = 0;
            deck.forEach((val, i) => {
                if (val === i) correctPositions++;
                totalDisplacement += Math.abs(val - i);
            });
            return { correctPositions, totalDisplacement };
        }

        function loop() {
            if (stopRef.current) return;

            let localBestShuffle = bestShuffleRef.current;
            let localBestDisplacement = bestDisplacementRef.current;
            let localBestCorrectPositions = bestCorrectPositionsRef.current;
            let current = data.current;
            let stats = data.stats;
            let shufflesThisFrame = 1000;

            for (let i = 0; i < shufflesThisFrame; i++) {
                current = shuffle(sortedDeck);
                stats = getStats(current);

                if (stats.totalDisplacement < localBestDisplacement) {
                    localBestDisplacement = stats.totalDisplacement;
                    localBestShuffle = [...current];
                    localBestCorrectPositions = stats.correctPositions;
                }
            }

            // Update refs so they persist for the next loop
            bestShuffleRef.current = localBestShuffle;
            bestDisplacementRef.current = localBestDisplacement;
            bestCorrectPositionsRef.current = localBestCorrectPositions;

            setData({
                current,
                stats,
                best: {
                    deck: localBestShuffle,
                    displacement: localBestDisplacement,
                    correctPositions: localBestCorrectPositions,
                },
            });

            setShuffleCount(count => count + shufflesThisFrame);

            setTimeout(loop, 0);
        }

        loop();

        return () => {
            stopRef.current = true;
        };
        // eslint-disable-next-line
    }, [isShuffling]);

    return (
        <Box
            style={{
                minHeight: '100%',
                background: '#14532d', // Poker table green felt
            }}
        >
            <Header
                onStart={() => setIsShuffling(true)}
                onStop={() => setIsShuffling(false)}
                isShuffling={isShuffling}
            />
            <Box style={{ display: 'flex', marginTop: 60, height: 'calc(100vh - 60px)' }}>
                <Sidebar h='100%' />
                <Box style={{ flex: 1, minWidth: 0 }}>
                    <Container size="sm" px="md" style={{ color: 'white', paddingTop: 40 }}>
                        <Text size="md" mb="sm" c="white">
                            Total shuffles: {shuffleCount.toLocaleString()}
                        </Text>
                        {isShuffling ? (
                            <ShuffleDisplay data={data} />
                        ) : (
                            <Center h={300}>
                                <Text size="xl" c="dimmed">
                                    Click "Start" to begin bogosorting the deck 🃏
                                </Text>
                            </Center>
                        )}
                    </Container>
                </Box>
            </Box>
        </Box>
    );
}

function Header({ onStart, onStop, isShuffling }) {
    return (
        <Box
            h={60}
            bg="dark.9"
            px="md"
            style={{
                borderBottom: '1px solid rgb(100,100,100)',
                position: 'fixed',
                top: 0,
                left: 0, // <-- changed from 200 to 0 for full width
                right: 0,
                zIndex: 100,
                width: '100vw', // ensure full width
                display: 'flex',
                alignItems: 'center'
            }}
        >
            <Group h='100%' w="100%" align='center' justify="space-between">
                <Text c="white" size="30px" fw={700}>
                    <i>Bogosort!</i>
                </Text>
                {isShuffling ? (
                    <Button color="red" onClick={onStop} aria-label="Stop shuffling">
                        Stop
                    </Button>
                ) : (
                    <Button color="green" onClick={onStart} aria-label="Start shuffling">
                        Start
                    </Button>
                )}
            </Group>
        </Box>
    );
}

function Sidebar() {
    return (
        <Box
            style={{
                width: 200,
                background: '#23232b',
                color: 'white',
                minHeight: 'calc(100vh - 60px)', // subtract header height
                borderRight: '1px solid rgb(100,100,100)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingTop: 24,
            }}
        >
            <Text fw={700} size="lg" mb={24}>Navigation</Text>
            <Button variant="subtle" color="gray" fullWidth mb={8}>Home</Button>
            <Button variant="subtle" color="gray" fullWidth mb={8}>Bogosort</Button>
            <Button variant="subtle" color="gray" fullWidth mb={8}>Settings</Button>
            {/* Add more nav items here */}
        </Box>
    );
}

function ShuffleDisplay({ data }) {
    function getCardLabel(index) {
        const suits = ['♠', '♥', '♦', '♣'];
        const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        const suit = suits[Math.floor(index / 13)];
        const rank = ranks[index % 13];
        return { label: `${rank}${suit}`, suit };
    }

    function getCardColor(suit) {
        // Hearts and Diamonds are red
        return suit === '♥' || suit === '♦' ? '#d7263d' : '#222';
    }

    const suitLabels = ['♠ Spades', '♥ Hearts', '♦ Diamonds', '♣ Clubs'];

    return (
        <Stack gap="sm" style={{ borderRadius: '10px', overflowY: 'auto', maxHeight: 'calc(100vh - 200px)', paddingBottom: 16, scrollbarWidth: 'none' }}>
            <Paper p="md" radius="md" withBorder bg="radial-gradient(ellipse at center, #357a38 60%, #14532d 100%)">
                <Text size="lg" fw={600}>Current Shuffle</Text>
                <Box
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4,
                        background: 'transparent',
                        padding: 8,
                        borderRadius: 8,
                        minHeight: 60,
                    }}
                >
                    {[0, 1, 2, 3].map(row => (
                        <Box key={row} style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                            <Text
                                style={{
                                    width: 100,
                                    minWidth: 60,
                                    textAlign: 'right',
                                    marginRight: 8,
                                    fontWeight: 700,
                                    color: 'white',
                                    fontSize: 16,
                                    fontFamily: 'serif',
                                    userSelect: 'none',
                                }}
                            >
                                {suitLabels[row]}
                            </Text>
                            {data.current.slice(row * 13, (row + 1) * 13).map((cardIdx, i) => {
                                const { label, suit } = getCardLabel(cardIdx);
                                const cardIndex = row * 13 + i;
                                const distance = Math.abs(cardIdx - cardIndex);
                                const percentRaw = distance / 51;
                                const percent = Math.pow(percentRaw, 0.15);
                                const r = Math.round(34 + (215 - 34) * percent);
                                const g = Math.round(215 - (215 - 38) * percent);
                                const b = Math.round(38 - (38 - 38) * percent);
                                const bgColor = `rgb(${r},${g},${b})`;
                                const isCorrect = distance === 0;
                                return (
                                    <Box
                                        key={cardIndex}
                                        style={{
                                            width: 32,
                                            height: 48,
                                            background: bgColor,
                                            color: getCardColor(suit),
                                            borderRadius: 4,
                                            border: '1px solid #bbb',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 600,
                                            fontSize: 16,
                                            boxShadow:
                                                isCorrect
                                                    ? '0 0 12px 4px #22d726, 0 1px 2px #0002'
                                                    : distance > 40
                                                        ? '0 0 16px 6px #d7263d, 0 1px 2px #0002'
                                                        : '0 1px 2px #0002',
                                            position: 'relative',
                                            transition: 'background 0.2s, box-shadow 0.2s',
                                        }}
                                    >
                                        {label}
                                        <Text
                                            size="xs"
                                            c="gray"
                                            style={{
                                                position: 'absolute',
                                                bottom: 2,
                                                right: 2,
                                                fontSize: 10,
                                                background: '#eee',
                                                borderRadius: 3,
                                                padding: '0 2px',
                                            }}
                                        >
                                            {distance}
                                        </Text>
                                    </Box>
                                );
                            })}
                        </Box>
                    ))}
                </Box>
                <Text>Total Displacement: {data.stats.totalDisplacement}</Text>
                <Text mt="sm">Correct Positions: {data.stats.correctPositions}</Text>
            </Paper>
            <Paper p="md" radius="md" withBorder bg="radial-gradient(ellipse at center, #357a38 60%, #14532d 100%)">
                <Text size="lg" fw={600}>Best Shuffle So Far</Text>
                <Box
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4,
                        background: 'transparent',
                        padding: 8,
                        borderRadius: 8,
                        minHeight: 60,
                    }}
                >
                    {[0, 1, 2, 3].map(row => (
                        <Box key={row} style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                            <Text
                                style={{
                                    width: 100,
                                    minWidth: 60,
                                    textAlign: 'right',
                                    marginRight: 8,
                                    fontWeight: 700,
                                    color: 'white',
                                    fontSize: 16,
                                    fontFamily: 'serif',
                                    userSelect: 'none',
                                }}
                            >
                                {suitLabels[row]}
                            </Text>
                            {data.best.deck.slice(row * 13, (row + 1) * 13).map((cardIdx, i) => {
                                const { label, suit } = getCardLabel(cardIdx);
                                const cardIndex = row * 13 + i;
                                const distance = Math.abs(cardIdx - cardIndex);
                                const percentRaw = distance / 51;
                                const percent = Math.pow(percentRaw, 0.4);
                                const r = Math.round(34 + (215 - 34) * percent);
                                const g = Math.round(215 - (215 - 38) * percent);
                                const b = Math.round(38 - (38 - 38) * percent);
                                const bgColor = `rgb(${r},${g},${b})`;
                                const isCorrect = distance === 0;
                                return (
                                    <Box
                                        key={cardIndex}
                                        style={{
                                            width: 32,
                                            height: 48,
                                            background: bgColor,
                                            color: getCardColor(suit),
                                            borderRadius: 4,
                                            border: '1px solid #bbb',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 600,
                                            fontSize: 16,
                                            boxShadow:
                                                isCorrect
                                                    ? '0 0 12px 4px #22d726, 0 1px 2px #0002'
                                                    : distance > 40
                                                        ? '0 0 16px 6px #d7263d, 0 1px 2px #0002'
                                                        : '0 1px 2px #0002',
                                            position: 'relative',
                                            transition: 'background 0.2s, box-shadow 0.2s',
                                        }}
                                    >
                                        {label}
                                        <Text
                                            size="xs"
                                            c="gray"
                                            style={{
                                                position: 'absolute',
                                                bottom: 2,
                                                right: 2,
                                                fontSize: 10,
                                                background: '#eee',
                                                borderRadius: 3,
                                                padding: '0 2px',
                                            }}
                                        >
                                            {distance}
                                        </Text>
                                    </Box>
                                );
                            })}
                        </Box>
                    ))}
                </Box>
                <Text mt="sm">Total Displacement: {data.best.displacement}</Text>
                <Text>Correct Positions: {data.best.correctPositions}</Text>
            </Paper>
            <Paper p="md" radius="md" withBorder bg="radial-gradient(ellipse at center, #357a38 60%, #14532d 100%)">
                <Text size="lg" fw={600}>Perfect Shuffle</Text>
                <Box
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4,
                        background: 'transparent',
                        padding: 8,
                        borderRadius: 8,
                        minHeight: 60,
                    }}
                >
                    {[0, 1, 2, 3].map(row => (
                        <Box key={row} style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                            <Text
                                style={{
                                    width: 100,
                                    minWidth: 60,
                                    textAlign: 'right',
                                    marginRight: 8,
                                    fontWeight: 700,
                                    color: 'white',
                                    fontSize: 16,
                                    fontFamily: 'serif',
                                    userSelect: 'none',
                                }}
                            >
                                {suitLabels[row]}
                            </Text>
                            {[...Array(13)].map((_, i) => {
                                const cardIndex = row * 13 + i;
                                const { label, suit } = getCardLabel(cardIndex);
                                // Perfect position: distance is always 0
                                return (
                                    <Box
                                        key={cardIndex}
                                        style={{
                                            width: 32,
                                            height: 48,
                                            background: '#22d726',
                                            color: getCardColor(suit),
                                            borderRadius: 4,
                                            border: '2px solid #22d726',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 600,
                                            fontSize: 16,
                                            boxShadow: '0 0 12px 4px #22d726, 0 1px 2px #0002',
                                            position: 'relative',
                                            transition: 'background 0.2s, box-shadow 0.2s',
                                        }}
                                    >
                                        {label}
                                        <Text
                                            size="xs"
                                            c="gray"
                                            style={{
                                                position: 'absolute',
                                                bottom: 2,
                                                right: 2,
                                                fontSize: 10,
                                                background: '#eee',
                                                borderRadius: 3,
                                                padding: '0 2px',
                                            }}
                                        >
                                            0
                                        </Text>
                                    </Box>
                                );
                            })}
                        </Box>
                    ))}
                </Box>
                <Text mt="sm">Total Displacement: 0</Text>
                <Text>Correct Positions: 52</Text>
            </Paper>
        </Stack>
    );
}

export default LandingPage;