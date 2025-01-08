'use client'

import { cn } from "@/utils/cn";
import { cva } from "class-variance-authority";
import { LucideAlertCircle, LucideCheckCircle, LucideInfo } from "lucide-react";
import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";



export const NotificationContext = createContext<{
    notify: (type : NotificationType, message : string) => void
    scheduleDelete: (id: number) => void}
    >({
        notify: () => {},
        scheduleDelete: () => {}
    });

type NotificationType = "error" | "success" | "info";

type Notification = {
    type: NotificationType,
    message: string,
    id: number,
    deleted?: boolean;
}

export const NotificationProvider = ({ children } : {children? : ReactNode}) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const notify = useCallback((type : NotificationType, message : string) => {
        const id = Date.now();
        setNotifications((prev) => {
            if (prev.length > 7) {
                scheduleDelete(prev[0].id);
            }

            return [...prev, { id, type, message }]
        });

        requestAnimationFrame(()=>{
            setNotifications((prev) => prev.map(e=>{
                if (e.id === id) {
                    e.deleted = false;
                }

                return e;
            }));
        })
        
        setTimeout(() => {
            scheduleDelete(id);
        }, 4000);
    },[]);

    const scheduleDelete = useCallback((id: number) => {
        setNotifications((prev) => prev.map(e=>{
            if (e.id === id) {
                e.deleted = true;
            }

            return e;
        }));

        setTimeout(() => {
            setNotifications((prev) => prev.filter((notification) => notification.id !== id));
        }, 300);
    },[])

    const contextValue = useMemo(()=>({
        notify,
        scheduleDelete
    }),[])

    return (
        <NotificationContext.Provider value={contextValue}>
            {children}
            <NotificationContainer notifications={notifications} />
        </NotificationContext.Provider>
    );
};

const NotifcationVariants = cva(
    "border-2 border-solid rounded-md p-2 translate-x-[120%] transition-[transform] duration-300 cursor-pointer flex w-full gap-2",
    {
        variants: {
            type: {
                error: "border-failure dark:bg-failure/20 bg-failure/40",
                success: "border-success dark:bg-success/20 bg-success/40",
                info: "border-info dark:bg-info/20 bg-info/40"
            },
            deleted: {
                false: "translate-x-0"
            }
        }
    }
)

function GetNotificationIcon(type: NotificationType) {
    switch (type) {
        case "error":
            return <LucideAlertCircle className="size-10 h-8"></LucideAlertCircle>
        case "info":
            return <LucideInfo className="size-10 h-8"></LucideInfo>;
        case "success":
            return <LucideCheckCircle className="size-10 h-8"></LucideCheckCircle>
    }
}

function NotificationContainer({notifications} : {notifications:Notification[]}) {
    const notificationContext = useContext(NotificationContext);

    return (
        <ul className="absolute p-2 right-0 bottom-16 max-w-full w-[450px] flex flex-col gap-1 overflow-hidden">
            {notifications.map(e=>(
                <li onClick={()=>notificationContext.scheduleDelete(e.id)} key={e.id} className={cn(NotifcationVariants({type: e.type, deleted: e.deleted}))}>
                    {GetNotificationIcon(e.type)}
                    {e.message}
                </li>
            ))}
        </ul>
    )
} 