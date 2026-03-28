package com.rentacar.service;

import com.rentacar.dto.request.CreateVehicleRequest;
import com.rentacar.dto.response.VehicleResponse;
import com.rentacar.exception.BusinessException;
import com.rentacar.exception.ResourceNotFoundException;
import com.rentacar.model.Vehicle;
import com.rentacar.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    public VehicleResponse createVehicle(CreateVehicleRequest request) {
        if (vehicleRepository.existsByLicensePlate(request.getLicensePlate())) {
            throw new BusinessException("Placa já cadastrada no sistema");
        }

        Vehicle vehicle = Vehicle.builder()
                .registrationNumber(request.getRegistrationNumber())
                .year(request.getYear())
                .brand(request.getBrand())
                .model(request.getModel())
                .licensePlate(request.getLicensePlate().toUpperCase())
                .ownerType(request.getOwnerType())
                .ownerId(request.getOwnerId())
                .dailyRate(request.getDailyRate())
                .available(true)
                .createdAt(LocalDateTime.now())
                .build();

        vehicle = vehicleRepository.save(vehicle);
        return toResponse(vehicle);
    }

    public List<VehicleResponse> getAvailableVehicles() {
        return vehicleRepository.findByAvailableTrue().stream()
                .map(this::toResponse)
                .toList();
    }

    public List<VehicleResponse> getAllVehicles() {
        return vehicleRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public VehicleResponse getVehicleById(String id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Veículo não encontrado"));
        return toResponse(vehicle);
    }

    public VehicleResponse updateVehicle(String id, CreateVehicleRequest request) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Veículo não encontrado"));

        if (!vehicle.getLicensePlate().equalsIgnoreCase(request.getLicensePlate())
                && vehicleRepository.existsByLicensePlate(request.getLicensePlate())) {
            throw new BusinessException("Placa já cadastrada no sistema");
        }

        vehicle.setRegistrationNumber(request.getRegistrationNumber());
        vehicle.setYear(request.getYear());
        vehicle.setBrand(request.getBrand());
        vehicle.setModel(request.getModel());
        vehicle.setLicensePlate(request.getLicensePlate().toUpperCase());
        vehicle.setOwnerType(request.getOwnerType());
        vehicle.setOwnerId(request.getOwnerId());
        vehicle.setDailyRate(request.getDailyRate());

        vehicle = vehicleRepository.save(vehicle);
        return toResponse(vehicle);
    }

    public void deleteVehicle(String id) {
        if (!vehicleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Veículo não encontrado");
        }
        vehicleRepository.deleteById(id);
    }

    public Vehicle getVehicleEntity(String id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Veículo não encontrado"));
    }

    public void setVehicleAvailability(String vehicleId, boolean available) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResourceNotFoundException("Veículo não encontrado"));
        vehicle.setAvailable(available);
        vehicleRepository.save(vehicle);
    }

    private VehicleResponse toResponse(Vehicle vehicle) {
        return VehicleResponse.builder()
                .id(vehicle.getId())
                .registrationNumber(vehicle.getRegistrationNumber())
                .year(vehicle.getYear())
                .brand(vehicle.getBrand())
                .model(vehicle.getModel())
                .licensePlate(vehicle.getLicensePlate())
                .ownerType(vehicle.getOwnerType())
                .ownerId(vehicle.getOwnerId())
                .dailyRate(vehicle.getDailyRate())
                .available(vehicle.getAvailable())
                .createdAt(vehicle.getCreatedAt())
                .build();
    }
}
