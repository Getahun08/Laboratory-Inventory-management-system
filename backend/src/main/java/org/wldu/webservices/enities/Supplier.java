
package org.wldu.webservices.enities;

import jakarta.persistence.*;

@Entity
@Table(name = "suppliers")
public class Supplier { 
   @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private String contactPerson;

    @Column(nullable = false)
    private String address;

//    @Column(nullable = false)




    public Supplier() {}

    public Supplier(String name, String email, String phoneNumber, String address,String contactPerson) {
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.contactPerson=contactPerson;
//        this.catagory=catagory;
    }



    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getContactPerson() {
        return contactPerson;
    }

//    public String getCatagory() {
//        return catagory;

//    public void setCatagory(String catagory) {
//        this.catagory = catagory;
//    }

    public void setContactPerson(String contactPerson) {
        this.contactPerson = contactPerson;
    }
   

   }
