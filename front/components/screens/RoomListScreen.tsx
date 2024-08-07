import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Button,
} from "react-native";
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
import Material from "react-native-vector-icons/MaterialIcons";
import ListRoom from "./Tab/ListRoom";
import PopularRoom from "./Tab/PopularRoom";
import RecentRoom from "./Tab/RecentRoom";

interface TabTitleProps {
  title: string;
  icon: React.ComponentType<any>;
  index: number;
}

const RoomListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  4;
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const theme = useTheme();
  const iconColor = theme["color-basic-600"];
  const activeColor = "#FF835C";

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(-1);
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          setUser(user);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const renderSearchIcon = (props: any) => (
    <Icon name="search" size={20} color={iconColor} {...props} />
  );

  const List = (props: any) => (
    <Icon name="list" size={20} color={iconColor} {...props} />
  );

  const Star = (props: any) => (
    <Icon name="star-o" size={20} color={iconColor} {...props} />
  );

  const New = (props: any) => (
    <Icon name="clock-o" size={20} color={iconColor} {...props} />
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

  const handleRefreshRooms = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };

  const renderItem = () => {
    if (selectedIndex === 0) {
      return <ListRoom navigation={navigation} refreshKey={refreshKey} />;
    } else if (selectedIndex === 1) {
      return <PopularRoom />;
    } else if (selectedIndex === 2) {
      return <RecentRoom />;
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontFamily: "Poppins-Bold" }}>
          Bonjour, {user ? user.name : "Chargement..."} 👋
        </Text>
        <TouchableOpacity onPress={handleRefreshRooms}>
          <Material name="refresh" size={23} color={iconColor} />
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <Input
          style={styles.input}
          accessoryLeft={renderSearchIcon}
          placeholder="Chercher une salle ..."
          placeholderTextColor="#A0A0A0"
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
          title={() => <TabTitle title="Récent" icon={New} index={2} />}
          onMouseEnter={() => handleTabHover(2)}
          onMouseLeave={() => handleTabHover(-1)}
        />
      </TabBar>
      <Divider
        style={{ backgroundColor: iconColor, borderRadius: 20, opacity: 0.1 }}
      />
      <FlatList
        data={[{ key: selectedIndex }]}
        renderItem={renderItem}
        keyExtractor={(item) => item.key.toString()}
        style={styles.content}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
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
    fontFamily: "Poppins",
    fontSize: 14,
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
    fontFamily: "Poppins",
  },
});

export default RoomListScreen;
