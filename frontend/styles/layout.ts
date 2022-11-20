import styled from 'styled-components';

export const FlexCenter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const FlexCenterPositioner = styled(FlexCenter)`
  width: 70%;
  left: 0;
  right: 0;
  margin: auto;
  flex-direction: column;
`;
export const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

export const FlexSpaceBetween = styled.div`
  display: flex;
  justify-content: space-between;
`;
