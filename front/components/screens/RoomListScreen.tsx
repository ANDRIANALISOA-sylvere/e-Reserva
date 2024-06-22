import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Text,
  Input,
  TabBar,
  Tab,
  useTheme,
  Divider,
} from "@ui-kitten/components";
import Icon from "react-native-vector-icons/FontAwesome";

interface TabTitleProps {
  title: string;
  icon: React.ComponentType<any>;
  index: number;
}

const RoomListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const theme = useTheme();
  const iconColor = theme["color-basic-600"];
  const activeColor = "#FF835C";

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(-1);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    navigation.replace("Login");
  };

  const renderSearchIcon = (props: any) => (
    <Icon name="search" size={20} color={iconColor} {...props} />
  );

  const List = (props: any) => (
    <Icon name="list" size={20} color={iconColor} {...props} />
  );

  const Star = (props: any) => (
    <Icon name="star" size={20} color={iconColor} {...props} />
  );

  const Award = (props: any) => (
    <Icon name="trophy" size={20} color={iconColor} {...props} />
  );

  const New = (props: any) => (
    <Icon name="plus-circle" size={20} color={iconColor} {...props} />
  );

  const handleTabSelect = (index: number) => {
    setSelectedIndex(index);
  };

  const handleTabHover = (index: number) => {
    setIsHovered(index);
  };

  const TabTitle = ({ title, icon: IconComponent, index }: TabTitleProps) => (
    <View style={styles.tab}>
      <IconComponent
        style={[
          styles.icon,
          {
            color:
              selectedIndex === index || isHovered === index
                ? activeColor
                : iconColor,
          },
        ]}
      />
      <Text
        style={[
          styles.tabText,
          {
            color:
              selectedIndex === index || isHovered === index
                ? activeColor
                : theme["color-basic-600"],
          },
        ]}
        category="s1"
      >
        {title}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text category="h6">Bonjour, Joséphin</Text>
        <Icon name="bell" size={24} style={styles.icon} color={iconColor} />
      </View>
      <View style={styles.searchContainer}>
        <Input
          style={styles.input}
          accessoryLeft={renderSearchIcon}
          placeholder="Chercher une salle ..."
        />
      </View>
      <TabBar
        selectedIndex={selectedIndex}
        onSelect={handleTabSelect}
        style={styles.tabBar}
        indicatorStyle={styles.indicator}
      >
        <Tab
          title={() => <TabTitle title="Tous" icon={List} index={0} />}
          onMouseEnter={() => handleTabHover(0)}
          onMouseLeave={() => handleTabHover(-1)}
        />
        <Tab
          title={() => <TabTitle title="Populaire" icon={Star} index={1} />}
          onMouseEnter={() => handleTabHover(1)}
          onMouseLeave={() => handleTabHover(-1)}
        />
        <Tab
          title={() => <TabTitle title="Top Noté" icon={Award} index={2} />}
          onMouseEnter={() => handleTabHover(2)}
          onMouseLeave={() => handleTabHover(-1)}
        />
        <Tab
          title={() => <TabTitle title="Nouvelle" icon={New} index={3} />}
          onMouseEnter={() => handleTabHover(3)}
          onMouseLeave={() => handleTabHover(-1)}
        />
      </TabBar>
      <Divider style={{ backgroundColor: iconColor, borderRadius: 20 , opacity:0.1}} />
      <View style={styles.content}>
        {selectedIndex === 0 && <Text category="h6">Tous les salles</Text>}
        {selectedIndex === 1 && <Text category="h6">Salles Populaires</Text>}
        {selectedIndex === 2 && <Text category="h6">Salles Top Notées</Text>}
        {selectedIndex === 3 && <Text category="h6">Nouvelle salle</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  icon: {
    width: 24,
    height: 24,
  },
  searchContainer: {
    marginTop: 20,
  },
  input: {
    borderRadius: 20,
  },
  tabBar: {
    backgroundColor: "transparent",
    marginTop: 20,
  },
  indicator: {
    backgroundColor: "#FF835C",
  },
  content: {
    marginTop: 20,
  },
  tab: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    textAlign: "center",
  },
});

export default RoomListScreen;
