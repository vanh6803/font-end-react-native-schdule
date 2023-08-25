import {
  View,
  Text,
  Button,
  FlatList,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useLayoutEffect, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import moment from 'moment';
import {baseUrl} from './constant';
import {Dropdown} from 'react-native-element-dropdown';

const itemDropDown = [
  {label: '7 ngày tiếp', value: 7},
  {label: '30 ngày tiếp', value: 30},
  {label: '7 ngày trước', value: -7},
  {label: '30 ngày trước', value: -30},
];

export default function Home() {
  const [data, setData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [itemVisibility, setItemVisibility] = useState({});
  const [value, setValue] = useState(7);
  const [isFocus, setIsFocus] = useState(false);

  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    callApi()
  }, []);

  useEffect(() => {
    filterByDate(value)
  },[data])

  //call api from server
  async function callApi() {
    const uid = await AsyncStorage.getItem('uid');
    axios
      .get(`${baseUrl}/api/schedule?uid=${uid}`)
      .then( response => {
        console.log('data from api: ' + JSON.stringify(response.data.data));
         setData(response.data.data);
      })
      .catch(error => {
        console.error(error.messages);
      });
  }

  //filter options
  const filterByDate = async enPoint => {
    const currentDay = new Date(Date.now());
    const endPoint = enPoint;
    const nextDays = calculateNextEndPointDays(currentDay, endPoint);
    if (data) {
      const filteredItems = data.filter(item => {
        const itemDate = moment(item.learnDay, 'DD-MM-YYYY');
        return nextDays.includes(formatDate(itemDate));
      });
      setFilteredData(filteredItems);
    }
  };

  //sort data
  const sortByLearnDayAndShift = (a, b) => {
    const learnDayComparison = moment(a.learnDay, 'DD-MM-YYYY').diff(moment(b.learnDay, 'DD-MM-YYYY'));
    if (learnDayComparison !== 0) {
      return learnDayComparison;
    }
    return a.schoolShift - b.schoolShift;
  };

  const filterAndSortData = () => {
    if (filteredData) {
      return filteredData.sort(sortByLearnDayAndShift);
    }
    return [];
  };

  //calculate next endpoint date
  function calculateNextEndPointDays(startDate, endPoint) {
    const nextDays = [];
    for (let i = 0; i < Math.abs(endPoint); i++) {
      const nextDay = moment(startDate).add(i * (endPoint < 0 ? -1 : 1), 'days');
      const nextDayFormat = formatDate(nextDay);
      nextDays.push(nextDayFormat);
    }
    return nextDays;
  }

  //format date
  function formatDate(date) {
    return moment(date).format('DD-MM-YYYY');
  }

  // visibility view details
  const toggleContentVisibility = itemId => {
    setItemVisibility(prevState => ({
      ...prevState,
      [itemId]: !prevState[itemId],
    }));
  };

  return (
    <View className="bg-white flex-1">
      <Dropdown
        style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={itemDropDown}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'Select item' : '...'}
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setValue(item.value);
          filterByDate(item.value);
          setIsFocus(false);
        }}
      />
      <FlatList
        className="mt-2"
        data={filterAndSortData()}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <View className="p-2 bg-white mb-3 rounded-md shadow-sm mx-2">
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => toggleContentVisibility(item._id)}>
              <View className="flex-row">
                <Text className="p-3 text-black text-[16px]">
                  {item.learnDay}
                </Text>
                <Text className="p-3 text-black text-[16px]">
                  {item.subject}
                </Text>
              </View>
            </TouchableOpacity>
            {itemVisibility[item._id] && (
              <View>
                <View className="bg-black h-[1px]" />
                <View className="p-3 ">
                  <View className="flex-row">
                    <Text className="pr-3  text-black">Lớp: {item.class}</Text>
                    <Text className="pl-3  text-black">Phòng: {item.room}</Text>
                  </View>
                  <View className="flex-row">
                    <Text className="pr-3  text-black">
                      Ca học: {item.schoolShift}
                    </Text>
                    <Text className="pl-3  text-black">
                      Giảng đường: {item.auditorium}
                    </Text>
                  </View>
                  <Text className=" text-black">
                    Giảng viên: {item.teacher}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    borderColor: 'black',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    margin: 10,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
});
