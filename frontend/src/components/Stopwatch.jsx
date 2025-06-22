import { Box, ButtonGroup, Button } from "@chakra-ui/react";

export default function Stopwatch({ start, stop, reset, formatTime }) {
  return (
    <Box display="flex" margin="2em 2em 0em 0em" alignContent="center">
      <div className="stopwatch">{formatTime()}</div>
      <div>
        <ButtonGroup variant="outline">
          <Button onClick={start}>Start</Button>
          <Button onClick={stop}>Stop</Button>
          <Button onClick={reset}>Reset</Button>
        </ButtonGroup>
      </div>
    </Box>
  );
}
