import { styled } from '@mui/material/styles';
import Slider from '@mui/material/Slider';

const PrettoSlider = styled(Slider)({
    color: '#fff',
    height: 4,
    '& .MuiSlider-track': {
        border: 'none',
    },
    '& .MuiSlider-thumb': {
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
            boxShadow: 'inherit',
        },
        '&::before': {
            display: 'none',
        },
    },
    '& .MuiSlider-valueLabel': {
        fontSize: 12,
        background: 'unset',
        padding: 3,
        height: 32,
        backgroundColor: '#0b1b49',
    },
});

export default PrettoSlider;
