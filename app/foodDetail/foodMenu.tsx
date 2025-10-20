import Text from "@/components/CustomText";
import { MealItem } from "@/models/meal";
import { searchFood } from "@/services/api/foodApi";
import { fetchFood, fetchFoods } from "@/database/supabase/fetchFood";
import { router } from "expo-router";
import * as React from "react";
import { FlatList, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CardSkeleton } from "@/components/CardSkeleton";

// Helper to initialize clicked state
const initialClickedState = (arr: MealItem[]) =>
  arr.reduce(
    (acc, item) => {
      acc[item.meal_id] = false;
      return acc;
    },
    {} as { [key: number]: boolean }
  );

// Memoized row component
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
      {addClicked[item.meal_id] ? (
        <Pressable
          className="w-10 h-10 rounded-full bg-white items-center justify-center"
          onPress={() => onRemoveClicked(item.meal_id)}
        >
          <Text className="text-3xl">-</Text>
        </Pressable>
      ) : (
        <Pressable
          className="w-10 h-10 rounded-full bg-white items-center justify-center"
          onPress={() => onAddClicked(item.meal_id)}
        >
          <Text className="text-3xl">+</Text>
        </Pressable>
      )}
    </Pressable>
  )
);

const AllFood = () => {
  const [foods, setFoods] = React.useState<MealItem[]>([]);
  const [addClicked, setAddClicked] = React.useState<{
    [key: number]: boolean;
  }>({});
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchFoodData = async () => {
      try {
        setLoading(true);
        const data = await fetchFoods();
        // const data = await searchFood({
        //   query: "egg",
        //   page: 0,
        //   max_results: 2,
        //   portion_size: 0,
        // });
        setFoods(data);
        setAddClicked(initialClickedState(data));
      } finally {
        setLoading(false);
      }
    };
    fetchFoodData();
  }, []);

  const onAddClicked = (id: number) => {
    setAddClicked((prev) => ({ ...prev, [id]: true }));
  };
  const onRemoveClicked = (id: number) => {
    setAddClicked((prev) => ({ ...prev, [id]: false }));
  };

  // Show skeleton while loading
  if (loading) {
    return (
      <View className="flex-1 px-7 pt-2 bg-white">
        <Text style={{ fontFamily: "PoppinsSemiBold", fontSize: 16 }}>
          Suggestions
        </Text>
        <FlatList
          data={Array.from({ length: 6 })}
          className="flex mt-1"
          keyExtractor={(_, i) => i.toString()}
          renderItem={() => <CardSkeleton height={70} />}
          ItemSeparatorComponent={() => <View style={{ marginBottom: 20 }} />}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 px-7 pt-2 bg-white">
      <Text style={{ fontFamily: "PoppinsSemiBold", fontSize: 16 }}>
        Suggestions
      </Text>
      <FlatList
        className="flex mt-1"
        data={foods}
        keyExtractor={(item) => item.meal_id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <FoodRow
            item={item}
            addClicked={addClicked}
            onAddClicked={onAddClicked}
            onRemoveClicked={onRemoveClicked}
          />
        )}
        // initialNumToRender={8}
        // maxToRenderPerBatch={8}
        // windowSize={5}
        // removeClippedSubviews={true}
        // getItemLayout={(data, index) => ({
        //   length: 80, // your row height including margin
        //   offset: 80 * index,
        //   index,
        // })}
      />
    </View>
  );
};

export default AllFood;
