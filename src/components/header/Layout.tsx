import styled from 'styled-components'

import zIndex from 'lib/styles/zIndex'

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 64px;
  z-index: ${zIndex.header};
`;

export const AutoLayout = styled.div`
  width: 100%;
  flex-grow: 1;
  display: flex;
  justify-content: center;

  & > div {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  & > div:last-child {
    margin-right: 8px;
  }
`;

export default Layout