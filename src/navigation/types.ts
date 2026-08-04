export type RootStackParamList = {
  Tabs: undefined;
  Search: { initialQuery?: string } | undefined;
  Detail: { id: number };
};

export type TabParamList = {
  Home: undefined;
  Favorites: undefined;
  Settings: undefined;
};
