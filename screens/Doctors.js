import { Animated, Dimensions, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import DoctorList from "../components/Doctor/DoctorList";
import Feather from "react-native-vector-icons/Feather"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import Ionicons from "react-native-vector-icons/Ionicons"
import { useCallback, useEffect, useRef, useState } from "react";
import COLORS from "../constants/colors";
import Apis, { endpoints } from "../config/Apis";
import Category from "./Category";
import { useDoctorRating } from "../context/DoctorRatingContext";
import BottomSheet from "../components/BottomSheet";
import Button from "../components/Button";
import CheckBox from "../components/CheckBox";
import Loading from "../components/Loading";
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import CustomLabel from "../components/CustomLabel";
import { curry, debounce } from "lodash";

const Doctors = ({ navigation }) => {
    const screenWidth = Dimensions.get('window').width;
    const [showFilterPopup, setShowFilterPopup] = useState(false)
    const [isSearch, setIsSearch] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [doctors, setDoctors] = useState([])
    const [feeRange, setFeeRange] = useState(null)
    const textInputRef = useRef(null)
    const { doctorRating, storeDoctorRating } = useDoctorRating();
    const [loading, setLoading] = useState(false)
    const [loadingDoctor, setLoadingDoctor] = useState(true)
    const [searchName, setSearchName] = useState('')
    const filterRef = useRef(null)
    const [filter, setFilter] = useState({
        departmentName: 'Đa khoa',
        departmentImage: require('../assets/images/departments/AllDepartments.png'),
        male: true,
        female: true,
        feeMin: feeRange?.minValue ?? 0,
        feeMax: feeRange?.maxValue ?? 0,
    })
    const [tempFilter, setTempFilter] = useState({
        male: true,
        female: true,
        feeMin: feeRange?.minValue ?? 0,
        feeMax: feeRange?.maxValue ?? 0,
    })

    const openFilterSheet = () => {
        setShowFilterPopup(true)
        setTempFilter(filter)
    }

    const closeFilterSheet = () => {
        setShowFilterPopup(false)
    }

    const clearTempFilter = () => {
        setTempFilter({
            male: true,
            female: true,
            feeMin: feeRange?.minValue ?? 0,
            feeMax: feeRange?.maxValue ?? 0,
        })
    }

    const setFilterValue = (props) => {
        // Update the filter state by merging the new values (props) with the previous state
        setFilter(prev => ({ ...prev, ...props }));
        // Update the ref with the new filter values
        filterRef.current = { ...filterRef.current, ...props };
    };



    const applyFilter = () => {
        setFilterValue(({ ...tempFilter }))
        setShowFilterPopup(false)
        fetchDoctors()
    }

    const fetchDoctors = async () => {
        try {
            setLoadingDoctor(true)
            console.log('Run fetchDoctors')
            const filter = filterRef.current
            console.log(filter)
            if (!filter) {
                return setLoadingDoctor(false)
            }
            const endpoint = `${endpoints["doctors"]}/?departmentName=${filter.departmentName === 'Đa khoa' ? '' : filter.departmentName}&feeMin=${filter.feeMin}
            &feeMax=${filter.feeMax}&gender=${(!filter.male && !filter.female) || (filter.male && filter.female) ? 2 : filter.male ? 0 : 1}`
            const res = await Apis.get(endpoint);
            setDoctors(res.data);
        } catch (error) {
            console.error("Error fetching doctors:", error);
        } finally {
            setLoadingDoctor(false)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const department = await Apis.get(endpoints.departments);
                setDepartments([
                    { name: "Đa khoa", image: 'AllDepartments' },
                    ...department.data,
                ]);
                const feeRange = await Apis.get(`${endpoints["fee"]}/range`)
                setFeeRange(feeRange.data)
                setFilterValue({
                    ...filter,
                    feeMin: feeRange.data.minValue,
                    feeMax: feeRange.data.maxValue,
                });
                fetchDoctors()
            } catch (error) {
                console.error("Error fetching data department:", error);
            }
        }
        fetchData()
    }, [])


    useEffect(() => {
        if (isSearch && textInputRef.current) {
            textInputRef.current.focus();
            setSearchName('')
        }
        setLoading(false)
    }, [isSearch])

    useEffect(() => {
        // Check if doctorRating is not null
        if (doctorRating !== null) {
            // Find the index of the doctor in the doctors list
            const index = doctors.findIndex((doctor) => doctor.userId === doctorRating.doctorId);
            // If the doctor is found in the list
            if (index !== -1) {
                // Create a new array to hold the updated doctors
                const updatedDoctors = [...doctors];
                // Update the rating of the found doctor
                updatedDoctors[index].rating = doctorRating.rating;
                // Update the state with the updated doctors list
                setDoctors(updatedDoctors);
            }
        }
    }, [doctorRating]);

    const tabs = [
        { key: 2, title: 'Bác sỹ' },
    ];

    const navigateDoctorDetail = (doctorId) => {
        navigation.navigate('DoctorDetail', doctorId);
    }

    const onClickDepartment = (item) => {
        setIsSearch(false)
        setFilterValue(({
            departmentName: item.name,
            departmentImage: item.imageUri,
        }))
        fetchDoctors()
    }

    return (
        <View style={styles.container}>
            {/*Header View */}
            <View style={styles.header}>
                {/* Location */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name='location-outline' color={'#3984dd'} size={25} />
                        <Text style={styles.locationTitle}>Tất cả</Text>
                        <FontAwesome name='sort-down' style={{ marginBottom: 5 }}></FontAwesome>
                    </TouchableOpacity>
                    {/* Cancel */}
                    {/* <TouchableOpacity>
                        <Text style={styles.cancel}>Hủy</Text>
                    </TouchableOpacity> */}
                </View>
                {/* Search input */}
                <TouchableOpacity onPress={() => setIsSearch(true)}>
                    <View style={[styles.searchContainer, isSearch && { borderColor: COLORS.toastInfo }]}>
                        {isSearch ?
                            <>
                                <TextInput
                                    style={styles.searchInput}
                                    value={searchName}
                                    onChangeText={text => setSearchName(text)}
                                    ref={textInputRef}
                                />
                                <Feather name="x" size={20} color="#000" style={styles.icon}
                                    onPress={() => setIsSearch(false)}
                                />
                            </> :
                            <>
                                <Image source={filter?.departmentImage} style={styles.image} />
                                <Text style={styles.searchInput}>{filter.departmentName}</Text>
                                <Feather name="search" size={20} color="#000" style={styles.icon} />
                            </>
                        }
                    </View>
                </TouchableOpacity>
            </View>

            {!isSearch ?
                <>
                    {/* Tab View */}
                    <View style={styles.stickyContent}>
                        {/* <View style={styles.tabContainer}>
                    {tabs.map((t) => (
                        <TouchableOpacity
                            key={t.key} style={[styles.tab, { backgroundColor: activeTab === t.key ? COLORS.primary : '#f8f9fd' }]}
                            onPress={() => setActiveTab(t.key)}>
                            <Text style={[styles.tabTitle, { color: activeTab === t.key ? '#FFFF' : '#504f54' }]}>{t.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View> */}
                        {/* Filter and Result */}
                        <View style={styles.filterContainer}>
                            {/* <Text style={{ fontWeight: '500' }}>2 Kết quả</Text> */}
                            <TouchableOpacity style={styles.filter} onPress={() => openFilterSheet()}>
                                <Text><FontAwesome size={17} name="sliders" color={'#6199d1'}></FontAwesome>  Lọc</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <DoctorList
                        loading={loadingDoctor}
                        doctors={doctors}
                        onItemclickEvent={navigateDoctorDetail} />
                </>
                : <Category
                    filterName={searchName}
                    departments={departments}
                    onClickItem={(item) => onClickDepartment(item)}
                    style={{ paddingTop: 20, flex: 1 }}
                />
            }
            <BottomSheet
                visible={showFilterPopup}
                onClose={() => closeFilterSheet()}>

                <View style={styles.flexRowCenter}>
                    <Text style={styles.popupTitle}>Lọc</Text>
                    <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={() => closeFilterSheet()}>
                        <Feather name="x" size={24} color={COLORS.textLabel} />
                    </TouchableOpacity>
                </View>

                {/* Gender filter */}
                <View style={{ marginTop: 16 }}>
                    <Text style={styles.label}>Giới tính</Text>
                    <View style={[styles.flexRowCenter, styles.input]}>
                        <Text style={{ marginRight: 'auto' }}>Nam</Text>
                        <CheckBox checked={tempFilter.male} color={COLORS.primary}
                            onPress={() => setTempFilter(prev => ({ ...prev, male: !tempFilter.male }))} />
                    </View>
                    <View style={[styles.flexRowCenter, styles.input]}>
                        <Text style={{ marginRight: 'auto' }}>Nữ</Text>
                        <CheckBox checked={tempFilter.female} color={COLORS.primary}
                            onPress={() => setTempFilter(prev => ({ ...prev, female: !tempFilter.female }))} />
                    </View>
                </View>

                {/* Fee filter */}
                <View style={{ marginTop: 16 }}>
                    <Text style={styles.label}>Phí khám</Text>
                    {feeRange &&
                        <>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <MultiSlider
                                    values={[tempFilter.feeMin, tempFilter.feeMax]}
                                    min={feeRange.minValue}
                                    max={feeRange.maxValue}
                                    sliderLength={screenWidth - 64}
                                    onValuesChangeFinish={(values) => setTempFilter(prev => ({ ...prev, feeMin: values[0], feeMax: values[1] }))}
                                    customLabel={CustomLabel}
                                    enableLabel={true}
                                    markerStyle={{ backgroundColor: COLORS.primary, height: 18, width: 18 }}
                                    selectedStyle={{ backgroundColor: COLORS.primary }}
                                />
                            </View>

                            <View style={styles.flexRowCenter}>
                                <Text style={styles.fee}>{`${feeRange.minValue.toLocaleString('vi-VN')} đ`}</Text>
                                <Text style={[styles.fee, { marginLeft: 'auto' }]}>{`${feeRange.maxValue.toLocaleString('vi-VN')} đ`}</Text>
                            </View>
                        </>
                    }

                </View>

                {/* Buttons */}
                <View style={styles.dashedLine} />
                <View style={styles.flexRowCenter}>
                    <TouchableOpacity onPress={clearTempFilter}>
                        <Text style={styles.deleteAllFilter}>Xóa tất cả</Text>
                    </TouchableOpacity>
                    <Button title="Áp dụng" filled style={{ marginLeft: 'auto', width: 120 }} onPress={applyFilter}
                    />
                </View>
            </BottomSheet>
            {loading && <Loading transparent={true} />}
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        position: 'relative',
    },
    flexRowCenter: {
        flexDirection: 'row', alignItems: 'center'
    },
    header: {
        backgroundColor: '#e1f1ff',
        paddingTop: 20,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    stickyContent: {
        backgroundColor: '#FFFF',
    },
    locationTitle: {
        fontSize: 17,
        fontWeight: '500',
        marginHorizontal: 7
    },
    cancel: {
        color: '#3386e7',
        fontWeight: '500',
        fontSize: 16
    },
    image: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#d0d6dd',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: 15,
        backgroundColor: 'white',
    },
    searchInput: {
        flex: 1,
        height: 40,
        textAlignVertical: 'center'
    },
    icon: {
        marginHorizontal: 5,
    },
    tabContainer: {
        marginVertical: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tab: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 20,
        marginHorizontal: 5,
    },
    tabTitle: {
        fontSize: 13,
        fontWeight: '500',
        textAlign: 'center',
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        alignItems: 'center',
        marginVertical: 20,
    },
    filter: {
        paddingVertical: 3,
        paddingHorizontal: 10,
        backgroundColor: '#e1f1ff',
        borderRadius: 5,
    },
    deleteAllFilter: {
        color: COLORS.textLabel,
        fontSize: 16,
        fontWeight: "bold"
    },
    label: {
        color: COLORS.textLabel,
        fontSize: 14,
        fontWeight: "bold"
    },
    input: {
        borderWidth: 0.8,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 16,
        backgroundColor: "white",
        marginTop: 8,
    },
    popupTitle: {
        fontSize: 18,
        textAlign: 'center',
        color: COLORS.textLabel,
        fontWeight: 'bold',
        marginLeft: 'auto'
    },
    fee: {
        fontWeight: 'bold'
    },
    dashedLine: {
        borderBottomColor: COLORS.grey,
        borderWidth: 0.5,
        opacity: 0.3,
        marginTop: 24,
        marginBottom: 12,
    }
});

export default Doctors;
