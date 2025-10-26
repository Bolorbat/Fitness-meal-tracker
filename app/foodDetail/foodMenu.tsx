import Text from "@/components/CustomText";
import { MealItem } from "@/models/meal";
import { fetchFoods } from "@/database/supabase/fetchFood";
import { router } from "expo-router";
import * as React from "react";
import { FlatList, Pressable, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { CardSkeleton } from "@/components/CardSkeleton";

const initialClickedState = (arr: MealItem[]) =>
  arr.reduce(
    (acc, item) => {
      acc[item.meal_id] = false;
      return acc;
    },
    {} as { [key: number]: boolean }
  );

const FoodRow = React.memo(
  ({
    item,
    addClicked,
    onAddClicked,
    onRemoveClicked,
  }: {
    item: MealItem;
    addClicked: { [key: number]: boolean };
    onAddClicked: (id: number) => void;
    onRemoveClicked: (id: number) => void;
  }) => (
    <Pressable
      className="relative flex-1 flex-row border h-20 border-neutral-400 rounded-2xl bg-[#F2F2F2] mb-5 items-center justify-between px-5"
      onPress={() =>
        router.push({
          pathname: "/foodDetail/[mealName]",
          params: { mealName: item.food_name },
        })
      }
    >
      <View className="flex-1 flex-col justify-center">
        <Text style={{ fontFamily: "PoppinsSemiBold" }}>{item.food_name}</Text>
        <Text className="text-gray-500">{item.calories + " cal"}</Text>
      </View>

      <Pressable
        className="w-10 h-10 rounded-full bg-white items-center justify-center"
        onPress={() =>
          addClicked[item.meal_id]
            ? onRemoveClicked(item.meal_id)
            : onAddClicked(item.meal_id)
        }
      >
        <Text className="text-3xl">{addClicked[item.meal_id] ? "-" : "+"}</Text>
      </Pressable>
    </Pressable>
  )
);

const MyFoods = () => {
  const [foods, setFoods] = React.useState<MealItem[]>([]);
  const [addClicked, setAddClicked] = React.useState<{
    [key: number]: boolean;
  }>({});
  const [isloading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchFoodData = async () => {
      setLoading(true);
      try {
        const data = await fetchFoods();
        setFoods(data);
        setAddClicked(initialClickedState(data));
      } finally {
        setLoading(false);
      }
    };
    fetchFoodData();
  }, []);

  const onAddClicked = React.useCallback((id: number) => {
    setAddClicked((prev) => ({ ...prev, [id]: true }));
  }, []);

  const onRemoveClicked = React.useCallback((id: number) => {
    setAddClicked((prev) => ({ ...prev, [id]: false }));
  }, []);

  const renderItem = React.useCallback(
    ({ item }: { item: MealItem }) => (
      <FoodRow
        item={item}
        addClicked={addClicked}
        onAddClicked={onAddClicked}
        onRemoveClicked={onRemoveClicked}
      />
    ),
    [addClicked]
  );

  if (isloading) {
    return (
      <FlatList
        className="flex-1 p-7 gap-5"
        data={Array.from({ length: 2 })}
        keyExtractor={(_, i) => i.toString()}
        renderItem={() => <CardSkeleton height={70} />}
        ItemSeparatorComponent={() => <View style = {{marginBottom : 20}} />}
        ListHeaderComponent={
          <>
            <Text
              style={{
                fontFamily: "PoppinsSemiBold",
                fontSize: 16,
                marginBottom: 8,
              }}
            >
              Suggestions
            </Text>
          </>
        }
      />
    );
  }

  return (
    <FlatList
      className="flex-1 p-7"
      data={foods}
      keyExtractor={(item) => item.meal_id.toString()}
      showsVerticalScrollIndicator={false}
      renderItem={renderItem}
      contentContainerStyle={{ marginBottom: 80 }}
      ListHeaderComponent={
        <Text
          style={{
            fontFamily: "PoppinsSemiBold",
            fontSize: 16,
            marginBottom: 8,
          }}
        >
          Suggestions
        </Text>
      }
    />
  );
};

const All = () => (
  <View className="flex-1 bg-white items-center justify-center">
    <Text>All Foods</Text>
  </View>
);
const MyMeals = () => (
  <View className="flex-1 bg-white items-center justify-center">
    <Text>My Meals</Text>
  </View>
);
const Saved = () => (
  <View className="flex-1 bg-white items-center justify-center">
    <Text>Saved Foods</Text>
  </View>
);

export default function AllFoodScreen() {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  const routes = React.useMemo(
    () => [
      { key: "all", title: "All" },
      { key: "myfoods", title: "My Foods" },
      { key: "mymeals", title: "My Meals" },
      { key: "saved", title: "Saved Foods" },
    ],
    []
  );

  const renderScene = React.useCallback(({ route }: any) => {
    switch (route.key) {
      case "all":
        return <All />;
      case "myfoods":
        return <MyFoods />;
      case "mymeals":
        return <MyMeals />;
      case "saved":
        return <Saved />;
      default:
        return null;
    }
  }, []);

  return (
    <View className="flex-1 bg-white">
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            scrollEnabled={false}
            indicatorStyle={{
              backgroundColor: "#222",
              height: 3,
              borderRadius: 2,
            }}
            style={{
              backgroundColor: "#fff",
              elevation: 0,
              borderBottomWidth: 1,
              borderBottomColor: "#e5e5e5",
            }}
            tabStyle={{ width: "auto", paddingHorizontal: 18 }}
            // labelStyle={{
            //   fontFamily: "PoppinsSemiBold",
            //   fontSize: 16,
            //   textTransform: "none",
            // }}
            activeColor="#000"
            inactiveColor="#A0A0A0"
          />
        )}
      />
    </View>
  );
}
