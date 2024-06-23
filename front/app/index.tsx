import React from "react";
import AppNavigator from "@/components/navigation/AppNavigator";
import { ApplicationProvider } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import { default as theme } from "../assets/theme.json";

export default function Index() {
  return (
    <>
      <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
        <AppNavigator />
      </ApplicationProvider>
    </>
  );
}
