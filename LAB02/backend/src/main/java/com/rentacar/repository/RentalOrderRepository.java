package com.rentacar.repository;

import com.rentacar.model.RentalOrder;
import com.rentacar.model.enums.OrderStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface RentalOrderRepository extends MongoRepository<RentalOrder, String> {

    List<RentalOrder> findByClientId(String clientId);

    List<RentalOrder> findByClientIdAndStatus(String clientId, OrderStatus status);

    List<RentalOrder> findByStatus(OrderStatus status);

    List<RentalOrder> findByVehicleIdAndStatusIn(String vehicleId, List<OrderStatus> statuses);
}
