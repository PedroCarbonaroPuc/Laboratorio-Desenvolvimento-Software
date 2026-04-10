package com.rentacar.repository;

import com.rentacar.model.RentalOrder;
import com.rentacar.model.enums.OrderStatus;
import io.micronaut.data.mongodb.annotation.MongoRepository;
import io.micronaut.data.repository.CrudRepository;

import java.util.List;

@MongoRepository
public interface RentalOrderRepository extends CrudRepository<RentalOrder, String> {

    List<RentalOrder> findByClientId(String clientId);

    List<RentalOrder> findByClientIdAndStatus(String clientId, OrderStatus status);

    List<RentalOrder> findByStatus(OrderStatus status);

    List<RentalOrder> findByVehicleIdAndStatusIn(String vehicleId, List<OrderStatus> statuses);

    List<RentalOrder> findAll();
}
