package com.webengineering.plantapp.backend.model;

import javax.persistence.*;
import java.util.List;

@Entity
public class GardenSpot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String street;
    private String streetNumber;
    private String postalCode;
    private String city;
    private String logo;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "gardenSpot", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GardenSpotPlant> plants;

    // Getter und Setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }

    public String getStreetNumber() { return streetNumber; }
    public void setStreetNumber(String streetNumber) { this.streetNumber = streetNumber; }

    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getLogo() { return logo; }
    public void setLogo(String logo) { this.logo = logo; }
}