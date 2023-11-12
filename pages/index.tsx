import moment, { Moment } from "moment";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { FlightDown, FlightUp, Pencil, Trash } from "../components/icons";
import { Rating } from "../components/componets";
import { Analytics } from "@vercel/analytics/react";

type flightType = {
    start: Moment;
    end: Moment;
    company: string;
    price: number;
};

export interface travelType {
    id?: number;
    country: string;
    city: string;
    flight: Partial<flightType>;
    rating?: number;
}

export default function Home() {
    const [travels, setTravels] = useState<travelType[]>();
    const [travel, setTravel] = useState<Partial<travelType>>();

    //still data
    useEffect(() => {
        if (!travels)
            fetch("/api/actions?data=1")
                .then((r) => r.json())
                .then((t: travelType[]) => {
                    setTravels(
                        t.map((tt: travelType) => ({
                            ...tt,
                            flight: {
                                ...tt.flight,
                                start: moment(
                                    tt.flight.start,
                                    "YYYY-MM-DD HH:mm"
                                ),
                                end: moment(tt.flight.end, "YYYY-MM-DD HH:mm"),
                            },
                        }))
                    );
                });
        localStorage.theme = "light";
    }, []);

    useEffect(() => {
        if (travel && travel.city !== "") {
            fetch("/api/actions?data=1", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    rating: 1,
                    ...travel,
                    id: travel.id || Date.now(),
                }),
            });
        }
        setTravel({
            city: "",
            country: "",
            rating: 1,
            flight: { company: "", price: 0 },
        });
    }, [travels]);
    console.log({ travel });
    return (
        <div className="container mx-auto p-8">
            <div className="">
                <h1 className="text-2xl font-bold">
                    Finder flight for the our birthday
                </h1>
                <div className="card shadow-md mt-6 w-full lg:w-1/2 bg-slate-100 mb-8">
                    <div className="card-body">
                        <h4 className="font-bold">Editor:</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <label htmlFor="">Country</label>
                            <input
                                type="text"
                                className="input input-bordered w-full input-sm"
                                value={travel?.country}
                                onChange={(e) =>
                                    setTravel({
                                        ...(travel || {}),
                                        country: e.target.value,
                                    })
                                }
                            />
                            <label htmlFor="">City</label>
                            <input
                                type="text"
                                className="input input-bordered w-full input-sm"
                                value={travel?.city}
                                onChange={(e) =>
                                    setTravel({
                                        ...(travel || {}),
                                        city: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <b>Flight:</b>
                        <div className="grid grid-cols-4 gap-4">
                            <label htmlFor="">Start</label>
                            <DatePicker
                                className="input input-sm w-full input-bordered"
                                showTimeSelect
                                selected={
                                    travel?.flight?.start?.toDate() || null
                                }
                                onChange={(e) =>
                                    setTravel({
                                        ...(travel || {}),
                                        flight: {
                                            ...(travel?.flight || {}),
                                            start: moment(e),
                                        },
                                    })
                                }
                                dateFormat="MM/dd HH:mm"
                            />

                            <label htmlFor="">End</label>
                            <DatePicker
                                className="input input-sm w-full input-bordered"
                                showTimeSelect
                                selected={travel?.flight?.end?.toDate() || null}
                                onChange={(e) =>
                                    setTravel({
                                        ...(travel || {}),
                                        flight: {
                                            ...(travel?.flight || {}),
                                            end: moment(e),
                                        },
                                    })
                                }
                                dateFormat="MM/dd HH:mm"
                            />
                            <label htmlFor="">Company</label>
                            <input
                                type="text"
                                className="input input-bordered w-full input-sm"
                                value={travel?.flight?.company}
                                onChange={(e) =>
                                    setTravel({
                                        ...(travel || {}),
                                        flight: {
                                            ...(travel?.flight || {}),
                                            company: e.target.value,
                                        },
                                    })
                                }
                            />
                            <label htmlFor="">Price</label>
                            <input
                                type="number"
                                className="input input-bordered w-full input-sm"
                                value={travel?.flight?.price}
                                onChange={(e) =>
                                    setTravel({
                                        ...(travel || {}),
                                        flight: {
                                            ...(travel?.flight || {}),
                                            price: parseFloat(e.target.value),
                                        },
                                    })
                                }
                            />
                        </div>
                        <button
                            className="btn btn-sm btn-success"
                            onClick={() => {
                                setTravels([
                                    ...(travels || []),
                                    {
                                        ...travel,
                                        id: travel?.id || Date.now(),
                                    } as travelType,
                                ]);
                            }}
                        >
                            Save
                        </button>
                    </div>
                </div>
                <hr />

                <ListTravels
                    travels={travels}
                    setTravel={setTravel}
                    setTravels={setTravels}
                />
            </div>
            <Analytics />
        </div>
    );
}

const ListTravels: React.FC<{
    travels?: travelType[];
    setTravels: (t: travelType[]) => void;
    setTravel: (t: travelType) => void;
}> = ({ travels, setTravels, setTravel }) => {
    const [order, setOrder] = useState<keyof travelType | keyof flightType>(
        "price"
    );
    return (
        <>
            <div className="mt-4 flex gap-3 text-sm text-gray-500">
                Order:
                <button
                    className={
                        "btn btn-sm btn-circle " +
                        (order === "price" ? " btn-active" : "")
                    }
                    onClick={() => {
                        setOrder("price");
                    }}
                >
                    €
                </button>
                <button
                    className={
                        "btn btn-sm btn-circle " +
                        (order === "rating" ? " btn-active" : "")
                    }
                    onClick={() => {
                        setOrder("rating");
                    }}
                >
                    ★
                </button>
            </div>
            <div className="flex gap-2 text-xs mt-2 flex-wrap">
                {(travels || [])
                    .sort((a, b) =>
                        order === "price"
                            ? (a.flight.price || 0) > (b.flight.price || 0)
                                ? 1
                                : -1
                            : (a.rating || 1) > (b.rating || 1)
                            ? 1
                            : -1
                    )
                    .map((t, i) => (
                        <div
                            className="stats shadow cursor-pointer bg-slate-50"
                            key={t.city + i}
                        >
                            <div className="stat">
                                <div className="stat-title text-base">
                                    <b className=" text-red-600 text-lg">
                                        {t.city}
                                    </b>{" "}
                                    {"|"} {t.country}{" "}
                                    <b>
                                        [ {t.flight.start?.format("D")} -{" "}
                                        {t.flight.end?.format("D")} ]
                                    </b>
                                    <button
                                        className="btn btn-xs btn-circle ml-4 -mr-2"
                                        onClick={() => {
                                            (travels || []).splice(i, 1);
                                            setTravel(t);
                                            setTravels(travels || []);
                                        }}
                                    >
                                        <Pencil />
                                    </button>
                                    <button
                                        className="btn btn-xs btn-circle ml-4 -mr-2"
                                        onClick={() => {
                                            fetch(`/api/actions?id=${t.id}`, {
                                                method: "DELETE",
                                            });

                                            travels &&
                                                setTravels(
                                                    travels?.filter(
                                                        (tt) => tt?.id !== t?.id
                                                    )
                                                );
                                        }}
                                    >
                                        <Trash />
                                    </button>
                                </div>
                                <div className="stat-value">
                                    {new Intl.NumberFormat("en-DE").format(
                                        t.flight.price || 0
                                    )}{" "}
                                    €
                                </div>
                                <div className="stat-desc text-base text-blue-600 flex gap-2">
                                    <b>{t.flight.company}</b> {":"}{" "}
                                    <span className="flex">
                                        <FlightUp />{" "}
                                        {t.flight.start?.format("HH:mm")}
                                    </span>
                                    <span className="flex">
                                        <FlightDown />{" "}
                                        {t.flight.end?.format("HH:mm")}
                                    </span>
                                </div>
                                <Rating
                                    name={`r_${i}`}
                                    value={t.rating || 1}
                                    onChange={(r) => {
                                        const tt = [...(travels || [])];
                                        tt.splice(i, 1);
                                        setTravel({ ...t, rating: r });
                                        setTravels([
                                            ...tt,
                                            { ...t, rating: r },
                                        ]);
                                    }}
                                />
                            </div>
                        </div>
                    ))}
            </div>
        </>
    );
};
