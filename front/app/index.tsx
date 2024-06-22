import AppNavigator from "@/components/navigation/AppNavigator";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import { default as theme } from "../assets/theme.json";

export default function Index() {
  return (
    <>
      {/* <IconRegistry icons={EvaIconsPack} /> */}
      <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
        <AppNavigator></AppNavigator>
      </ApplicationProvider>
    </>
  );
}
