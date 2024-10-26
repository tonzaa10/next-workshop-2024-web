'use client'
import { useEffect, useState } from "react"
import MyModal from '../components/ํMyModal'
import Swal from "sweetalert2"
import axios from "axios"
import config from "@/app/config"
export default function Page() {
    const [name, setName] = useState('')
    const [remark, setRemark] = useState('')
    const [id, setId] = useState(0)
    const [foodTypeId, setFoodTypeId] = useState(0)
    const [moneyAdded, setMoneyAdded] = useState(0)
    const [foodTypes, setFoodTypes] = useState([])
    const [foodSizes, setFoodSizes] = useState([])
    useEffect(() => {
        fetchData();
        fetchDataFoodSizes();
    }, [])
    const fetchData = async () => {
        try {
            const res = await axios.get(config.apiServer + "/api/foodSize/list");
            setFoodSizes(res.data.results)
        } catch (e: any) {
            Swal.fire({
                title: "error",
                text: e.message,
                icon: "error"
            })
        }
    };
    const fetchDataFoodSizes = async () => {
        try {
            const res = await axios.get(config.apiServer + "/api/foodType/list");
            setFoodTypes(res.data.results);
            setFoodTypeId(res.data.results[0].id)
        } catch (e: any) {
            Swal.fire({
                title: "error",
                text: e.message,
                icon: "error"
            })
        }
    };
    const edit = (item: any) => {
        setFoodTypeId(item.foodTypeId);
        setId(item.id);
        setMoneyAdded(item.moneyAdded);
        setName(item.name);
        setRemark(item.remark);
    };
    const remove = async (item: any) => {
        try {
            const button = await Swal.fire({
                title: 'ลบข้อมูล',
                text: 'คุณต้องการลบข้อมูลนี้',
                icon: 'question',
                showCancelButton: true,
                showConfirmButton: true
            })
            if (button.isConfirmed) {
                await axios.delete(config.apiServer + '/api/foodSize/remove/' + item.id);
                fetchData();
            }
        } catch (e: any) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }
    const save = async () => {
        try {
            const payload = {
                name: name,
                remark: remark,
                id: id,
                foodTypeId: foodTypeId,
                moneyAdded: moneyAdded
            }
            if (id == 0) {
                await axios.post(config.apiServer + "/api/foodSize/create", payload)
            } else {
                await axios.put(config.apiServer + "/api/foodSize/update", payload);
                setId(0);
            }
            fetchData();
            document.getElementById("modalFoodSize_btnClose")?.click();
        } catch (e: any) {
            Swal.fire({
                title: "error",
                text: e.message,
                icon: "error"
            })
        }
    };
    const clearForm = () => {
        setId(0);
        setName('');
        setRemark('');
        setMoneyAdded(0);
    }
    return (
        <>
            <div className="card mt-3">
                <div className="card-header">ขนาดอาหาร</div>
                <div className="card-body">
                    <button className="btn btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#modalFoodSize"
                        onClick={clearForm}>
                        <i className="fa fa-plus mr-2"></i> เพิ่มรายการ
                    </button>
                    <table className='mt-3 table table-bordered table-striped'>
                        <thead>
                            <tr>
                                <th style={{ width: "150px" }}>ประเภทอาหาร</th>
                                <th style={{ width: "100px" }}>ชือ</th>
                                <th>หมายเหตุ</th>
                                <th className="text-end" style={{ width: "100px" }}>คิดเงินเพิ่ม</th>
                                <th style={{ width: "110px" }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {foodSizes.map((item: any) => (
                                <tr key={item.id}>
                                    <td>{item.FoodType.name}</td>
                                    <td>{item.name}</td>
                                    <td>{item.remark}</td>
                                    <td className="text-end">{item.moneyAdded}</td>
                                    <td className="text-center">
                                        <button className="btn btn-primary me-2" 
                                        data-bs-toggle="modal"
                                        data-bs-target="#modalFoodSize"
                                        onClick={(e) => edit(item)}>
                                            <i className="fa fa-edit"></i>
                                        </button>
                                        <button className="btn btn-danger" onClick={(e) => remove(item)}>
                                            <i className="fa fa-times"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <MyModal id="modalFoodSize" title="ขนาดอาหาร/เครื่องดื่ม">
                <div>ประเภทอาหาร</div>
                <select className="form-control" onChange={(e) => setFoodTypeId(parseInt(e.target.value))}>
                    {foodTypes.map((item: any) =>
                    (
                        <option value={item.id} key={item.id}>
                            {item.name}
                        </option>
                    ))}
                </select>
                <div className="mt-3">ชื่อ</div>
                <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
                <div className="mt-3">คิดเงินเพิ่ม (บาท)</div>
                <input className="form-control" value={moneyAdded} onChange={(e) => setMoneyAdded(parseInt(e.target.value))} />
                <div className="mt-3">หมายเหตุ</div>
                <input className="form-control" value={remark} onChange={(e) => setRemark(e.target.value)} />
                <button className="mt-3 btn btn-primary" onClick={save}>
                    <i className="fa fa-check me-2"></i>บันทึก
                </button>
            </MyModal>
        </>
    )
}