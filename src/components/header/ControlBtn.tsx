import styled from 'styled-components'
// lib
import * as styles from 'lib/styles/styles'
import palette from 'lib/styles/palette'

const ControlBtn = ({ message, onClick }: Props) => {
  return <Btn onClick={() => onClick()}>{message}</Btn>;
}

const Btn = styled.button`
  height: 50%;
  padding: 0 16px;
  cursor: pointer;
  display: flex;
  border: 1px solid black;
  align-items: center;
  justify-content: center;
  transition: .1s ${styles.transition};
  outline: none;

  &:focus, &:hover {
    color: ${palette.blue3};
  }

  &:first-child {
    margin-left: 8px;
  }
`;

interface Props {
  message: string;
  onClick: (value?: boolean) => void;
}

export default ControlBtn