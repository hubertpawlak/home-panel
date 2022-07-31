export interface ThirdPartyUser {
  email: string;
  id: string;
  thirdParty: {
    id: string;
    userId: string;
  };
  timeJoined: number;
}
