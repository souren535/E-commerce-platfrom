import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Country, State, City } from "country-state-city";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectGroup,
  SelectValue,
} from "@/components/ui/select";

const CountrySelector = ({
  selectedCountry,
  setSelectedCountry,
  selectedState,
  setSelectedState,
  selectedCity,
  setSelectedCity,
}) => {
  // const [countries] = useState(["India"]);
  // const [states, setStates] = useState([]);
  // const [cities, setCities] = useState([]);
  // fetch country data
  // useEffect(() => {
  //   setLoading(true);
  //   axios
  //     .get("https://countriesnow.space/api/v0.1/countries/positions")
  //     .then((res) => {
  //       if (res.data && res.data.data) {
  //         const countryNames = res.data.data.map((c) => c.name);
  //         setCountries(countryNames);
  //       } else {
  //         setError("Invalid response format from countries API");
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("country fetch error", error);
  //       setError("Failed to fetch countries");
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // }, []);

  // fetch state when country is selected
  // useEffect(() => {
  //   if (selectedCountry) {
  //     setLoading(true);
  //     axios
  //       .post("https://countriesnow.space/api/v0.1/countries/states", {
  //         country: selectedCountry,
  //       })
  //       .then((res) => {
  //         if (res.data && res.data.data && res.data.data.states) {
  //           const stateNames = res.data.data.states.map((s) => s.name);
  //           setStates(stateNames);
  //           setSelectedState("");
  //           setCities([]);
  //         }
  //       })
  //       .catch((err) => {
  //         console.error("state fetch error", err);
  //       })
  //       .finally(() => {
  //         setLoading(false);
  //       });
  //   } else {
  //     setStates([]);
  //   }
  // }, [selectedCountry]);

  // useEffect(() => {
  //   if (selectedCountry && selectedState) {
  //     setLoading(true);
  //     axios
  //       .post("https://countriesnow.space/api/v0.1/countries/state/cities", {
  //         country: selectedCountry,
  //         state: selectedState,
  //       })
  //       .then((res) => {
  //         if (res.data && res.data.data) {
  //           setCities(res.data.data);
  //         }
  //       })
  //       .catch((err) => {
  //         console.error("city fetch error", err);
  //       })
  //       .finally(() => {
  //         setLoading(false);
  //       });
  //   } else {
  //     setCities([]);
  //   }
  // }, [selectedCountry, selectedState]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (Country.getAllCountries()) {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState) {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [selectedState]);

  const handleCountryChange = (value) => {
    setSelectedCountry(value === "none" ? "" : value);
    setSelectedState("");
    setSelectedCity("");
    setLoading(true);
  };

  const handleStateChange = (value) => {
    setSelectedState(value === "none" ? "" : value);
    setSelectedCity("");
    setLoading(true);
  };

  const handleCityChange = (value) => {
    setSelectedCity(value === "none" ? "" : value);
  };

  return (
    <>
      <div className="country_group flex flex-col pt-6.5 ">
        {/* country */}
        <div className="Countries mb-10">
          <Label htmlFor="country" className="text-xl mb-2">
            Country
          </Label>
          <Select
            value={selectedCountry}
            onValueChange={handleCountryChange}
            disabled={loading}
          >
            <SelectTrigger className="w-[310px] p-5.5 placeholder:text-white border-1 bg-zinc-800 border-zinc-700 text-zinc-400 [&>span]:text-zinc-400">
              <SelectValue
                placeholder={
                  loading ? "Loading countries..." : "Select a country"
                }
                className="text-zinc-700 placeholder:text-zinc-700"
              />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-1 border-zinc-700 max-h-[400px]">
              <SelectGroup>
                <SelectItem
                  value="none"
                  className="text-white hover:bg-zinc-700 hover:text-zinc-400 focus:text-zinc-400 focus:bg-zinc-700"
                >
                  Select a Country
                </SelectItem>
                {Country.getAllCountries().map((country) => (
                  <SelectItem
                    className="text-white hover:bg-zinc-700 hover:text-zinc-400 focus:text-zinc-400 focus:bg-zinc-700"
                    key={country.isoCode}
                    value={country.isoCode}
                  >
                    {country.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* states */}
        {selectedCountry && (
          <div className="states mb-10">
            <Label htmlFor="state" className="text-xl mb-2">
              State
            </Label>
            <Select
              value={selectedState}
              onValueChange={handleStateChange}
              disabled={!selectedCountry || loading}
            >
              <SelectTrigger className="w-[310px] p-5.5 placeholder:text-white border-1 bg-zinc-800 border-zinc-700 text-zinc-400 [&>span]:text-zinc-400">
                <SelectValue
                  placeholder={
                    !selectedCountry
                      ? "Select a country first"
                      : loading
                      ? "Loading states..."
                      : "Select a state"
                  }
                  className="text-zinc-700 placeholder:text-zinc-700"
                />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-1 border-zinc-700 max-h-[400px]">
                <SelectGroup>
                  <SelectItem
                    value="none"
                    className="text-white hover:bg-zinc-700 hover:text-zinc-400 focus:text-zinc-400 focus:bg-zinc-700"
                  >
                    Select a State
                  </SelectItem>
                  {State.getStatesOfCountry(selectedCountry).map((state) => (
                    <SelectItem
                      className="text-white hover:bg-zinc-700 focus:bg-zinc-700 hover:text-zinc-400 focus:text-zinc-400"
                      key={state.isoCode}
                      value={state.isoCode}
                    >
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* cities */}
        {selectedCountry && selectedState && (
          <div className="cities mb-10">
            <Label htmlFor="city" className="text-xl mb-2">
              City
            </Label>
            <Select
              value={selectedCity}
              onValueChange={handleCityChange}
              disabled={!selectedState || loading}
            >
              <SelectTrigger className="w-[310px] p-5.5 placeholder:text-white border-1 bg-zinc-800 border-zinc-700 text-zinc-400 [&>span]:text-zinc-400">
                <SelectValue
                  placeholder={
                    !selectedState
                      ? "Select a state first"
                      : loading
                      ? "Loading cities..."
                      : "Select a city"
                  }
                  className="text-zinc-700 placeholder:text-zinc-700"
                />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-1 border-zinc-700">
                <SelectGroup>
                  <SelectItem
                    value="none"
                    className="text-white hover:bg-zinc-700 hover:text-zinc-400 focus:text-zinc-400 focus:bg-zinc-700"
                  >
                    Select a City
                  </SelectItem>
                  {City.getCitiesOfState(selectedCountry, selectedState).map(
                    (city) => (
                      <SelectItem
                        className="text-white hover:bg-zinc-700 hover:text-zinc-400 focus:text-zinc-400 focus:bg-zinc-700"
                        key={city.name}
                        value={city.name}
                      >
                        {city.name}
                      </SelectItem>
                    )
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </>
  );
};

export default CountrySelector;
