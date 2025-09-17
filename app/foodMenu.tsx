import { searchFood } from "@/api/fatsecret/foodApi";
import Text from "@/components/CustomText";
import { MealItem } from "@/models/meal";
import { router, useNavigation } from "expo-router";
import * as React from "react";
import { FlatList, Pressable, View, useWindowDimensions } from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";

type FoodDetails = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

const initialClickedState = (arr: MealItem[]) =>
  arr.reduce(
    (acc, item) => {
      acc[item.meal_id] = false;
      return acc;
    },
    {} as { [key: number]: boolean }
  );

const AllFood = () => {
  const [foods, setFoods] = React.useState<MealItem[]>([]);
  React.useEffect(() => {
    const fetchFoods = async () => {
      const data = await searchFood({ query: "apple" });
      setFoods(data);
    };
    fetchFoods();
  }, []);
  const [addClicked, setAddClicked] = React.useState(
    initialClickedState(foods)
  );
  const onAddClicked = (id: number) => {
    setAddClicked((prev) => ({ ...prev, [id]: true }));
  };
  const onRemoveClicked = (id: number) => {
    setAddClicked((prev) => ({ ...prev, [id]: false }));
  };
  return (
    <View className="flex px-7 pt-2">
      <Text style={{ fontFamily: "PoppinsSemiBold", fontSize: 16 }}>
        Suggestions
      </Text>
      <FlatList
        className="mt-1"
        data={foods}
        keyExtractor={(item) => item.meal_id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }: { item: MealItem }) => (
          <Pressable
            className="relative flex-1 flex-row border h-20 border-neutral-400 rounded-2xl bg-[#F2F2F2] mb-5 items-center justify-between px-5"
            onPress={() =>
              router.push({
                pathname: "/[footDetail]",
                params: { footDetail: item.food_name },
              })
            }
          >
            <View className="flex-1 flex-col justify-center">
              <Text style={{ fontFamily: "PoppinsSemiBold" }}>
                {item.food_name}
              </Text>
              <Text className="text-gray-500">{item.calories + " cal"}</Text>
            </View>
            {addClicked[item.meal_id] ? (
              <Pressable
                className="w-10 h-10 rounded-full bg-white items-center justify-center"
                onPress={() => {
                  onRemoveClicked(item.meal_id);
                  console.log(item.food_name + " REMOVE CLICKED");
                }}
              >
                <Text className="text-3xl">-</Text>
              </Pressable>
            ) : (
              <Pressable
                className="w-10 h-10 rounded-full bg-white items-center justify-center"
                onPress={() => {
                  onAddClicked(item.meal_id);
                  console.log(item.food_name + " NEMEH CLICKED");
                }}
              >
                <Text className="text-3xl">+</Text>
              </Pressable>
            )}
          </Pressable>
        )}
      />
    </View>
  );
};

const MyFood = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>My Food</Text>
    </View>
  );
};

const MyMeals = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>My Meals</Text>
    </View>
  );
};

const SavedFoods = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Saved Foods</Text>
    </View>
  );
};

export default function FoodMenu() {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const navigation = useNavigation();
  const [routes] = React.useState([
    { key: "all", title: "All" },
    { key: "myFood", title: "My food" },
    { key: "myMeals", title: "My meals" },
    { key: "savedFoods", title: "Saved foods" },
  ]);

  const renderScene = SceneMap({
    all: AllFood,
    myFood: MyFood,
    myMeals: MyMeals,
    savedFoods: SavedFoods,
  });

  return (
    <TabView
      style={{ backgroundColor: "white" }}
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      initialLayout={{ width: layout.width }}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: "black", height: 1 }}
          style={{
            backgroundColor: "white",
            elevation: 0,
            shadowRadius: 0,
            shadowOpacity: 0,
          }}
          inactiveColor={"#adabaf"}
          activeColor={"black"}
          tabStyle={{ width: "auto" }}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      )}
    />
  );
}
