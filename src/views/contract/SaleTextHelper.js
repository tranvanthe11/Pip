import React, { useState, useEffect } from 'react'
import styled from "styled-components"

const SaleTextHelper = ({ contract, customerResult, pickupList, destinationList }) => {
    console.log(contract)
  return (
    <div>
        <>
            <h5>Step 0 : Giới thiệu pippip</h5>
            <b>Hướng dẫn : Sau khi add zalo hoặc qua hình thức nhắn tin nào đó</b>
            <BodyText>
                <LineText>Gửi tin nhắn :</LineText>
                <LineText>Mình bên dịch vụ đặt xe pippip.vn</LineText>
            </BodyText>
                
        </>
        <>
            <h5>Step 1 : xác nhận đơn hàng</h5>
            <b>Hướng dẫn : sau khi lên đơn cho khách trên hệ thống</b>
            <BodyText>
                <LineText>Gửi tin nhắn :</LineText>
                <LineText>Mình gửi link check đơn hàng : pippip.vn/checkdonhang/{contract?.order_code}</LineText>
            </BodyText>      
        </>
        {contract?.contract_payment && contract?.contract_payment[0].payment_status==0 && <>
            <h5>Step 2 : thông tin chuyển khoản</h5>
            <b>Hướng dẫn : sau khi gửi xác nhận đơn và chốt hình thức thanh toán với khách</b>
            <BodyText>
                <LineText>Gửi tin nhắn :</LineText>
                <LineText>Ngân hàng: Vietcombank - Chi nhánh Thành Công</LineText>
                <LineText>Số tài khoản: 0451000327817</LineText>
                <LineText>Tên: Trần Ngọc Hiếu</LineText>
                <LineText>Số tiền: {`${contract?.price} VND`.replace(/\B(?=(\d{3})+(?!\d))/g,",")}</LineText>
                <LineText>Nội dung: {`${contract?.order_code}`}</LineText>
                <LineText></LineText>
            </BodyText>      
        </>}
        {<>
            <h5>Step 3 : lưu ý đơn hàng</h5>
            <b>Hướng dẫn : sau khi xác nhận khách đã thanh toán</b>
            <BodyText>
                <LineText>Gửi tin nhắn :</LineText>
                <LineText>Link check đơn hàng: pippip.vn/checkdonhang/{contract?.order_code}</LineText>
                <LineText>Ghi chú về chuyến {contract?.service_name}</LineText>
                <LineText>{(contract?.service_type!=2) ? "Các chuyến đón khách từ 3h tới 7h sáng, hệ thống sẽ có thông tin xe muộn nhất là 23h ngày hôm trước." : "Hệ thống sẽ dựa theo thời gian hạ cánh của máy bay và thời gian khách hàng đi lấy hành lý (nếu có) để sắp xếp xe đưa đón phù hợp nhất."}</LineText>
                <LineText>{(contract?.service_type!=2) ? "Các khoảng thời gian đón khác trong ngày, hệ thống sẽ có thông tin xe trước 15' ~ 30' khi đón." : "Khi xuống sân bay, khách hàng mở app kiểm tra đơn hàng để check thông tin lái xe đưa đón, đồng thời chú ý điện thoại để lái xe có thể liên hệ với khách hàng."}</LineText>
                <LineText>Bất khả kháng</LineText>
                <LineText>Trong trường hợp mưa bão, đường ngập lụt hoặc các trường hợp bất khả kháng xe không thể di chuyển thì chuyến đi sẽ bị huỷ và khách hàng sẽ được hỗ trợ hoàn tiền theo quy định.</LineText>
            </BodyText>        
        </>}
        {(contract?.contract_status==0 || contract?.contract_status==1 || contract?.contract_status==2) && <>
            <h5>Step 4 : reminder</h5>
            <b>Hướng dẫn : khi gần tới ngày đi của khách hàng</b>
            <BodyText>
                <LineText>Gửi tin nhắn :</LineText>
                <LineText>
                    {`[Pippip Reminder] ${contract?.pickup_time}, Quý khách có chuyến xe ${contract?.car_type_name}, 
                    đón tại ${pickupList} ${contract?.service_type==2 ? `Số hiệu chuyến bay: ${contract?.flight_number}` : ""}  => Đến : ${destinationList} ${contract?.service_type==1 ? `Số hiệu chuyến bay: ${contract?.flight_number}` : ""}`} 
                </LineText>
                <LineText>Link check đơn hàng: pippip.vn/checkdonhang/{contract?.order_code}</LineText>
                <LineText>Ghi chú về chuyến {contract?.service_name}</LineText>
                <LineText>{(contract?.service_type!=2) ? "Các chuyến đón khách từ 3h tới 7h sáng, hệ thống sẽ có thông tin xe muộn nhất là 23h ngày hôm trước." : "Hệ thống sẽ dựa theo thời gian hạ cánh của máy bay và thời gian khách hàng đi lấy hành lý (nếu có) để sắp xếp xe đưa đón phù hợp nhất."}</LineText>
                <LineText>{(contract?.service_type!=2) ? "Các khoảng thời gian đón khác trong ngày, hệ thống sẽ có thông tin xe trước 15' ~ 30' khi đón." : "Khi xuống sân bay, khách hàng mở app kiểm tra đơn hàng để check thông tin lái xe đưa đón, đồng thời chú ý điện thoại để lái xe có thể liên hệ với khách hàng."}</LineText>
                <LineText>Bất khả kháng</LineText>
                <LineText>Trong trường hợp mưa bão, đường ngập lụt hoặc các trường hợp bất khả kháng xe không thể di chuyển thì chuyến đi sẽ bị huỷ và khách hàng sẽ được hỗ trợ hoàn tiền theo quy định.</LineText>
                <LineText></LineText>
            </BodyText>     
        </>}
        {contract?.supplier && <>
            <h5>Step 5 : thông tin xe và update</h5>
            <b>Hướng dẫn : khi có thông tin xe</b>
            <BodyText>
                <LineText>Gửi tin nhắn :</LineText>
                <LineText>Nền tảng đặt xe pippip.vn gửi khách hàng thông tin xe</LineText>
                <LineText>{`${contract?.pickup_time} đón tại ${pickupList} ${contract?.service_type==2 ? `Số hiệu chuyến bay: ${contract?.flight_number}` : ""} => Đến : ${destinationList} ${contract?.service_type==1 ? `Số hiệu chuyến bay: ${contract?.flight_number}` : ""}`}</LineText>
                <LineText>Khách: {customerResult&&customerResult[0].customer_name} - {customerResult&&customerResult[0].customer_phone}</LineText>
                <LineText>Lái xe: {contract?.supplier?.driver_name}</LineText>
                <LineText>Số điện thoại: {contract?.supplier?.driver_phone}</LineText>
                <LineText>Loại xe: {contract?.supplier?.car_name}</LineText>
                <LineText>Biển số xe: {contract?.supplier?.car_number}</LineText>
                <LineText>{(contract?.contract_payment[0].payment_status == 0 && contract?.contract_payment[0].payment_method == 1) && ((`Quý khách vui lòng chuyển khoản ${`${(contract?.contract_payment[0].amount)} VND`.replace(/\B(?=(\d{3})+(?!\d))/g,",")} khi lên xe ngày ${contract?.pickup_time}`))}</LineText>
                <LineText>{(contract?.contract_payment[0].payment_status == 0 && contract?.contract_payment[0].payment_method == 1) && ((`Thông tin chuyển khoản`))}</LineText>
                <LineText>{(contract?.contract_payment[0].payment_status == 0 && contract?.contract_payment[0].payment_method == 1) && ((`Vietcombank - Chi nhánh Thành Công`))}</LineText>
                <LineText>{(contract?.contract_payment[0].payment_status == 0 && contract?.contract_payment[0].payment_method == 1) && ((`Tên TK : Trần Ngọc Hiếu`))}</LineText>
                <LineText>{(contract?.contract_payment[0].payment_status == 0 && contract?.contract_payment[0].payment_method == 1) && ((`STK : 0451000327817`))}</LineText>
                <LineText>{(contract?.contract_payment[0].payment_status == 0 && contract?.contract_payment[0].payment_method == 1) && ((`Nội dung: ${contract?.order_code} `))}</LineText>
                <LineText>{(contract?.contract_payment[0].payment_status == 0 && contract?.contract_payment[0].payment_method == 1) && ((`Số tiền: ${`${(contract?.contract_payment[0].amount)} VND`.replace(/\B(?=(\d{3})+(?!\d))/g,",")}`))}</LineText>
                <LineText>{(contract?.contract_payment[0].payment_status == 0 && contract?.contract_payment[0].payment_method == 0) && ((`Quý khách vui lòng thanh toán tiền mặt cho lái xe sau khi kết thúc hành trình số tiền là: ${`${(contract?.contract_payment[0].amount)} VND`.replace(/\B(?=(\d{3})+(?!\d))/g,",")}`))}</LineText>
                <LineText>{(contract?.contract_payment[1]?.payment_status == 0 && contract?.contract_payment[1].payment_method == 1 && contract?.contract_payment[0].payment_status == 1) && ((`Quý khách vui lòng chuyển khoản ${`${(contract?.contract_payment[0].amount)} VND`.replace(/\B(?=(\d{3})+(?!\d))/g,",")} khi lên xe ngày ${contract?.pickup_time}`))}</LineText>
                <LineText>{(contract?.contract_payment[1]?.payment_status == 0 && contract?.contract_payment[1].payment_method == 1 && contract?.contract_payment[0].payment_status == 1) && ((`Thông tin chuyển khoản`))}</LineText>
                <LineText>{(contract?.contract_payment[1]?.payment_status == 0 && contract?.contract_payment[1].payment_method == 1 && contract?.contract_payment[0].payment_status == 1) && ((`Vietcombank - Chi nhánh Thành Công`))}</LineText>
                <LineText>{(contract?.contract_payment[1]?.payment_status == 0 && contract?.contract_payment[1].payment_method == 1 && contract?.contract_payment[0].payment_status == 1) && ((`Tên TK : Trần Ngọc Hiếu`))}</LineText>
                <LineText>{(contract?.contract_payment[1]?.payment_status == 0 && contract?.contract_payment[1].payment_method == 1 && contract?.contract_payment[0].payment_status == 1) && ((`STK : 0451000327817`))}</LineText>
                <LineText>{(contract?.contract_payment[1]?.payment_status == 0 && contract?.contract_payment[1].payment_method == 1 && contract?.contract_payment[0].payment_status == 1) && ((`Nội dung: ${contract?.order_code} `))}</LineText>
                <LineText>{(contract?.contract_payment[1]?.payment_status == 0 && contract?.contract_payment[1].payment_method == 1 && contract?.contract_payment[0].payment_status == 1) && ((`Số tiền: ${`${(contract?.contract_payment[0].amount)} VND`.replace(/\B(?=(\d{3})+(?!\d))/g,",")}`))}</LineText>
                <LineText>{(contract?.contract_payment[1]?.payment_status == 0 && contract?.contract_payment[1].payment_method == 0) && ((`Quý khách vui lòng thanh toán tiền mặt cho lái xe sau khi kết thúc hành trình số tiền là: ${`${(contract?.contract_payment[0].amount)} VND`.replace(/\B(?=(\d{3})+(?!\d))/g,",")}`))}</LineText>
                <LineText>Nếu có vấn đề gì cần phản ánh hoặc hỗ trợ, quý khách vui lòng gọi lên hotline điều xe - Mr Hiếu - 0969559556<br/></LineText>
            </BodyText>
        </>}
        {<>
            <h5>Step 6 : Hỏi feedback khách hàng</h5>
            <b>sau khi lái xe trả khách thì nhắn tin hỏi feedback</b>
            <BodyText>
                <LineText>Gửi tin nhắn :</LineText>
                <LineText>Chuyến hôm nay anh || chị || bạn || em đi có ổn không ạ?</LineText>
            </BodyText>       
        </>}
    </div>
  )
}

export default SaleTextHelper

const BodyText = styled.p`
    display: block;
`;
const LineText = styled.span`
    display: block;
`;